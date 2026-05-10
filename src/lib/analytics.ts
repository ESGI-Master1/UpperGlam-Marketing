import posthog from 'posthog-js'
import type { PostHogConfig } from 'posthog-js'

export const posthogOptions: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  autocapture: true,
  capture_pageleave: true,
  capture_pageview: false,
  person_profiles: 'identified_only',
}

export const ANALYTICS_CONSENT_STORAGE_KEY = 'ug_cookie_consent'
export const ANALYTICS_CONSENT_CHANGED_EVENT = 'ug-cookie-consent-changed'
export const COOKIE_PREFERENCES_OPEN_EVENT = 'ug-cookie-preferences-open'

export type AnalyticsConsentStatus = 'accepted' | 'refused'

export type AnalyticsEventName =
  | 'cookie_consent_updated'
  | 'cta_click'
  | 'faq_item_toggle'
  | 'form_submit'
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

export function trackEvent(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  if (!hasAnalyticsConsent()) return

  posthog.capture(event, properties)
}

export function trackPageView(
  properties: Record<string, string | number | boolean | null | undefined>
) {
  if (!hasAnalyticsConsent()) return

  posthog.capture('$pageview', properties)
  trackEvent('page_view', properties)
}
