import { useEffect } from 'react'
import { PageMeta } from '../components/common/PageMeta'
import { Section } from '../components/ui/Section'
import { trackEvent } from '../lib/analytics'

const loginTarget =
  import.meta.env.VITE_PUBLIC_LOGIN_URL?.trim() || 'https://example.com/login'

export function LoginRedirectPage() {
  useEffect(() => {
    trackEvent('outbound_click', {
      destination: loginTarget,
      location: 'login_route',
      type: 'login_redirect',
    })
    window.location.assign(loginTarget)
  }, [])

  return (
    <>
      <PageMeta
        description="Redirection vers la plateforme de connexion."
        noindex
        title="Login"
      />
      <Section>
        <p className="text-sm text-[var(--ug-muted)]">
          Redirection vers la plateforme de connexion...
        </p>
      </Section>
    </>
  )
}
