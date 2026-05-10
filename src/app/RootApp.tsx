import { useEffect, useState } from 'react'
import { PostHogProvider } from 'posthog-js/react'
import { App } from './App'
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  getAnalyticsConsentStatus,
  posthogOptions,
} from '../lib/analytics'

type RootAppProps = {
  posthogKey?: string
}

export function RootApp({ posthogKey }: RootAppProps) {
  const [consentStatus, setConsentStatus] = useState(getAnalyticsConsentStatus)

  useEffect(() => {
    const syncConsent = () => {
      setConsentStatus(getAnalyticsConsentStatus())
    }

    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, syncConsent)
    window.addEventListener('storage', syncConsent)

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, syncConsent)
      window.removeEventListener('storage', syncConsent)
    }
  }, [])

  if (!posthogKey || consentStatus !== 'accepted') return <App />

  return (
    <PostHogProvider apiKey={posthogKey} options={posthogOptions}>
      <App />
    </PostHogProvider>
  )
}
