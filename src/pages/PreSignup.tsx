import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { PreSignupForm } from '../components/pre-signup/PreSignupForm'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { trackEvent } from '../lib/analytics'

type PreSignupRole = 'provider' | 'user'

const roleConfig = {
  provider: {
    ctaLabel: 'Créer mon profil professionnel',
    intro: 'Présentez votre activité et les prestations que vous proposez.',
    title: 'Créer mon profil professionnel',
    trackingFormName: 'pre_signup_pro' as const,
  },
  user: {
    ctaLabel: 'Créer mon profil client',
    intro:
      'Renseignez vos préférences pour trouver les prestations qui vous correspondent.',
    title: 'Créer mon profil client',
    trackingFormName: 'pre_signup_client' as const,
  },
}

export function PreSignupPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialRole = searchParams.get('role')
  const [role, setRole] = useState<PreSignupRole | null>(
    initialRole === 'provider' || initialRole === 'user' ? initialRole : null
  )

  const selectRole = (nextRole: PreSignupRole) => {
    setRole(nextRole)
    setSearchParams({ role: nextRole })
    trackEvent('pre_signup_role_selected', {
      form_name: roleConfig[nextRole].trackingFormName,
      funnel_name: 'pre_signup',
      funnel_step: 'role_selected',
      role: nextRole,
    })
  }

  return (
    <>
      <PageMeta
        description="Créez votre profil Upper Glam en tant que client ou professionnel de la beauté."
        title="Créer mon profil"
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4">
          <Card className="space-y-4">
            <h1 className="text-3xl sm:text-4xl">
              Vous etes pro ou particulier ?
            </h1>
            <p className="text-sm text-[var(--ug-muted)]">
              Commencez par choisir votre profil pour afficher le formulaire
              adapte.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                className="w-full"
                onClick={() => selectRole('user')}
                type="button"
                variant={role === 'user' ? 'primary' : 'secondary'}
              >
                Je suis particulier(e)
              </Button>
              <Button
                className="w-full"
                onClick={() => selectRole('provider')}
                type="button"
                variant={role === 'provider' ? 'primary' : 'secondary'}
              >
                Je suis pro
              </Button>
            </div>
          </Card>

          {role && <PreSignupForm role={role} {...roleConfig[role]} />}
        </div>
      </Section>
    </>
  )
}
