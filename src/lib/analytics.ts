import type { PostHogConfig } from 'posthog-js'

export const posthogOptions: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  autocapture: true,
  before_send: (event) => {
    if (!event) return null

    const eventUrl = String(event.properties?.$current_url ?? '')
    const pathname = eventUrl
      ? new URL(eventUrl, window.location.origin).pathname
      : window.location.pathname

    return pathname.startsWith('/admin') ? null : event
  },
  capture_pageleave: true,
  capture_pageview: false,
  disable_session_recording: true,
  person_profiles: 'identified_only',
}

export const ANALYTICS_CONSENT_STORAGE_KEY = 'ug_cookie_consent'
export const ANALYTICS_CONSENT_CHANGED_EVENT = 'ug-cookie-consent-changed'
export const COOKIE_PREFERENCES_OPEN_EVENT = 'ug-cookie-preferences-open'
const ANALYTICS_ATTRIBUTION_STORAGE_KEY = 'ug_marketing_attribution'
const ANALYTICS_FIRST_VISIT_STORAGE_KEY = 'ug_first_analytics_visit'
const ANALYTICS_PREVIOUS_PATH_STORAGE_KEY = 'ug_previous_path'
const ANALYTICS_SESSION_STARTED_STORAGE_KEY = 'ug_analytics_session_started'
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

type AnalyticsPropertyValue = string | number | boolean | null | undefined
type AnalyticsProperties = Record<string, AnalyticsPropertyValue>
type PostHog = (typeof import('posthog-js'))['default']

let posthogPromise: Promise<PostHog> | null = null

export async function initializeAnalytics(apiKey: string): Promise<PostHog> {
  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      if (!posthog.__loaded) posthog.init(apiKey, posthogOptions)
      return posthog
    })
  }

  return posthogPromise
}

async function getPostHog(): Promise<PostHog | null> {
  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  if (!apiKey || !hasAnalyticsConsent()) return null

  return initializeAnalytics(apiKey)
}

export type AnalyticsConsentStatus = 'accepted' | 'refused'

export type AnalyticsEventName =
  | 'cookie_consent_updated'
  | 'cta_click'
  | 'faq_item_toggle'
  | 'form_submit'
  | 'form_submit_attempt'
  | 'form_submit_error'
  | 'legal_link_click'
  | 'nav_click'
  | 'outbound_click'
  | 'media_impression'
  | 'page_engaged'
  | 'page_view'
  | 'pre_signup_role_selected'
  | 'scroll_depth'
  | 'session_start'
  | 'video_play'
  | 'video_progress'

export function getAnalyticsConsentStatus(): AnalyticsConsentStatus | null {
  if (typeof window === 'undefined') return null

  const consent = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
  if (consent === 'accepted' || consent === 'refused') return consent

  return null
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsentStatus() === 'accepted'
}

export function setAnalyticsConsentStatus(status: AnalyticsConsentStatus) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, status)
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_CHANGED_EVENT, {
      detail: { status },
    })
  )
}

export function openCookiePreferences() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT))
}

function readStoredAttribution(): AnalyticsProperties {
  try {
    const stored = window.sessionStorage.getItem(
      ANALYTICS_ATTRIBUTION_STORAGE_KEY
    )

    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function writeStoredAttribution(properties: AnalyticsProperties) {
  try {
    window.sessionStorage.setItem(
      ANALYTICS_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(properties)
    )
  } catch {
    // Ignore storage failures to avoid breaking the user journey.
  }
}

export async function applyAnalyticsConsent(
  apiKey: string,
  status: AnalyticsConsentStatus
) {
  if (status === 'accepted') {
    const posthog = await initializeAnalytics(apiKey)
    posthog.opt_in_capturing()
    return
  }

  if (posthogPromise) {
    const posthog = await posthogPromise
    posthog.opt_out_capturing()
  }
}

function getHostname(value: string) {
  if (!value) return ''

  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function getTrafficChannel(
  attribution: AnalyticsProperties,
  referrerDomain: string
) {
  const medium = String(attribution.utm_medium ?? '').toLowerCase()
  if (/(cpc|ppc|paid|display|affiliate)/.test(medium)) return 'paid'
  if (/email|newsletter/.test(medium)) return 'email'

  if (attribution.utm_source) return 'campaign'
  if (!referrerDomain || referrerDomain === window.location.hostname) {
    return 'direct'
  }
  if (/(google|bing|yahoo|duckduckgo|ecosia|qwant)\./.test(referrerDomain)) {
    return 'organic_search'
  }
  if (
    /(instagram|facebook|tiktok|linkedin|pinterest|snapchat|x\.com|t\.co)/.test(
      referrerDomain
    )
  ) {
    return 'organic_social'
  }

  return 'referral'
}

export function getAnalyticsContextProperties(): AnalyticsProperties {
  if (typeof window === 'undefined') return {}

  const url = new URL(window.location.href)
  const storedAttribution = readStoredAttribution()
  const urlAttribution = UTM_KEYS.reduce<AnalyticsProperties>((acc, key) => {
    const value = url.searchParams.get(key)
    if (value) acc[key] = value

    return acc
  }, {})
  const hasFreshUtm = Object.keys(urlAttribution).length > 0
  const initialReferrer = String(
    storedAttribution.initial_referrer ?? document.referrer ?? ''
  )
  const referrerDomain = getHostname(initialReferrer)
  const attribution: AnalyticsProperties = {
    ...storedAttribution,
    ...urlAttribution,
    entry_path: storedAttribution.entry_path ?? url.pathname,
    entry_search: storedAttribution.entry_search ?? url.search,
    initial_referrer: initialReferrer,
  }

  if (hasFreshUtm || !storedAttribution.entry_path) {
    writeStoredAttribution(attribution)
  }

  return {
    ...attribution,
    current_path: url.pathname,
    current_search: url.search,
    current_url: url.href,
    browser_language: navigator.language,
    referrer_domain: referrerDomain,
    referrer: document.referrer ?? '',
    screen_height: window.screen.height,
    screen_width: window.screen.width,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    traffic_channel: getTrafficChannel(attribution, referrerDomain),
    traffic_source: attribution.utm_source || referrerDomain || 'direct',
    viewport_height: window.innerHeight,
    viewport_width: window.innerWidth,
  }
}

export function trackEvent(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties
) {
  if (!hasAnalyticsConsent()) return false

  void getPostHog().then((posthog) => {
    posthog?.capture(event, {
      ...getAnalyticsContextProperties(),
      ...properties,
    })
  })

  return true
}

export function trackPageView(properties: AnalyticsProperties) {
  if (!hasAnalyticsConsent()) return

  const previousPath = window.sessionStorage.getItem(
    ANALYTICS_PREVIOUS_PATH_STORAGE_KEY
  )
  const pageViewProperties = {
    ...getAnalyticsContextProperties(),
    previous_path: previousPath ?? '',
    ...properties,
  }

  window.sessionStorage.setItem(
    ANALYTICS_PREVIOUS_PATH_STORAGE_KEY,
    window.location.pathname
  )

  void getPostHog().then((posthog) => {
    posthog?.capture('$pageview', pageViewProperties)
    posthog?.capture('page_view', pageViewProperties)
  })
}

export function trackSessionStart() {
  if (!hasAnalyticsConsent()) return false
  if (
    window.sessionStorage.getItem(ANALYTICS_SESSION_STARTED_STORAGE_KEY) ===
    'true'
  ) {
    return false
  }

  const isReturningVisitor =
    window.localStorage.getItem(ANALYTICS_FIRST_VISIT_STORAGE_KEY) === 'true'
  window.localStorage.setItem(ANALYTICS_FIRST_VISIT_STORAGE_KEY, 'true')
  window.sessionStorage.setItem(ANALYTICS_SESSION_STARTED_STORAGE_KEY, 'true')

  return trackEvent('session_start', {
    is_returning_visitor: isReturningVisitor,
  })
}
