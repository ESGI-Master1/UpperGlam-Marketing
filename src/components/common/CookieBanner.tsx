import { useEffect, useState } from 'react'
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  COOKIE_PREFERENCES_OPEN_EVENT,
  getAnalyticsConsentStatus,
  setAnalyticsConsentStatus,
  trackEvent,
} from '../../lib/analytics'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'

export function CookieBanner() {
  const [consentStatus, setConsentStatus] = useState(getAnalyticsConsentStatus)
  const [visible, setVisible] = useState(() => !getAnalyticsConsentStatus())

  useEffect(() => {
    const syncConsent = () => {
      const nextStatus = getAnalyticsConsentStatus()
      setConsentStatus(nextStatus)
      if (!nextStatus) setVisible(true)
    }

    const openPreferences = () => {
      setConsentStatus(getAnalyticsConsentStatus())
      setVisible(true)
    }

    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, syncConsent)
    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, openPreferences)
    window.addEventListener('storage', syncConsent)

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, syncConsent)
      window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, openPreferences)
      window.removeEventListener('storage', syncConsent)
    }
  }, [])

  if (!visible) return null

  const isFirstChoice = !consentStatus

  const closeBanner = () => {
    if (isFirstChoice) return
    setVisible(false)
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-[var(--ug-border)] bg-[color:var(--ug-banner-bg)] py-4">
      <Container className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="text-sm text-[var(--ug-muted)]">
            Nous utilisons des cookies essentiels. Le tracking analytique reste
            desactive tant que vous n'acceptez pas.
          </p>
          {!isFirstChoice && (
            <p className="text-xs text-[var(--ug-muted)]">
              Statut actuel :{' '}
              {consentStatus === 'accepted'
                ? 'analytics actif'
                : 'analytics inactif'}
              .
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {consentStatus !== 'accepted' && (
            <Button
              onClick={() => {
                setAnalyticsConsentStatus('accepted')
                trackEvent('cookie_consent_updated', { status: 'accepted' })
                setVisible(false)
              }}
              size="md"
              variant="primary"
            >
              Accepter
            </Button>
          )}
          {consentStatus !== 'refused' && (
            <Button
              onClick={() => {
                setAnalyticsConsentStatus('refused')
                setVisible(false)
              }}
              size="md"
              variant="secondary"
            >
              Refuser
            </Button>
          )}
          {!isFirstChoice && (
            <Button onClick={closeBanner} size="md" variant="secondary">
              Fermer
            </Button>
          )}
        </div>
      </Container>
    </div>
  )
}
