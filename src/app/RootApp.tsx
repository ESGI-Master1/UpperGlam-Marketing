import { useEffect, useState } from 'react'
import type { RouterProviderProps } from 'react-router-dom'
import { App } from './App'
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  applyAnalyticsConsent,
  getAnalyticsConsentStatus,
  trackSessionStart,
} from '../lib/analytics'

type RootAppProps = {
  posthogKey?: string
  router: RouterProviderProps['router']
}

export function RootApp({ posthogKey, router }: RootAppProps) {
  const [consentStatus, setConsentStatus] =
    useState<ReturnType<typeof getAnalyticsConsentStatus>>(null)

  useEffect(() => {
    const syncConsent = () => {
      setConsentStatus(getAnalyticsConsentStatus())
    }

    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, syncConsent)
    window.addEventListener('storage', syncConsent)
    syncConsent()

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, syncConsent)
      window.removeEventListener('storage', syncConsent)
    }
  }, [])

  useEffect(() => {
    if (posthogKey && consentStatus) {
      void applyAnalyticsConsent(posthogKey, consentStatus).then(() => {
        if (consentStatus === 'accepted') trackSessionStart()
      })
    }
  }, [consentStatus, posthogKey])

  return <App router={router} />
}
