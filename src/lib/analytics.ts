import posthog from 'posthog-js'
import type { PostHogConfig } from 'posthog-js'

export const posthogOptions: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  autocapture: true,
  capture_pageleave: true,
  capture_pageview: false,
  person_profiles: 'identified_only',
}

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

export function trackEvent(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  posthog.capture(event, properties)
}
