import { useState } from 'react'
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  setAnalyticsConsentStatus,
  trackEvent,
} from '../../lib/analytics'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    const consent = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
    return !consent
  })

  if (!visible) return null

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-[var(--ug-border)] bg-[color:var(--ug-banner-bg)] py-4">
      <Container className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-[var(--ug-muted)]">
          Nous utilisons des cookies essentiels. Le tracking analytique sera
          active uniquement avec votre accord.
        </p>
        <div className="flex gap-2">
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
        </div>
      </Container>
    </div>
  )
}
