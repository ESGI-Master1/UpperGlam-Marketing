import posthog from 'posthog-js'
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
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

type AnalyticsPropertyValue = string | number | boolean | null | undefined
type AnalyticsProperties = Record<string, AnalyticsPropertyValue>

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
  | 'page_view'
  | 'pre_signup_role_selected'

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
  const attribution: AnalyticsProperties = {
    ...storedAttribution,
    ...urlAttribution,
    entry_path: storedAttribution.entry_path ?? url.pathname,
    entry_search: storedAttribution.entry_search ?? url.search,
    initial_referrer:
      storedAttribution.initial_referrer ?? document.referrer ?? '',
  }

  if (hasFreshUtm || !storedAttribution.entry_path) {
    writeStoredAttribution(attribution)
  }

  return {
    ...attribution,
    current_path: url.pathname,
    current_search: url.search,
    current_url: url.href,
    referrer: document.referrer ?? '',
    traffic_source: attribution.utm_source ?? 'direct',
  }
}

export function trackEvent(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties
) {
  if (!hasAnalyticsConsent()) return

  posthog.capture(event, {
    ...getAnalyticsContextProperties(),
    ...properties,
  })
}

export function trackPageView(properties: AnalyticsProperties) {
  if (!hasAnalyticsConsent()) return

  const pageViewProperties = {
    ...getAnalyticsContextProperties(),
    ...properties,
  }

  posthog.capture('$pageview', pageViewProperties)
  posthog.capture('page_view', pageViewProperties)
}
