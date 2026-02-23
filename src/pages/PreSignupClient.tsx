import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Section } from '../components/ui/Section'
import { trackEvent } from '../lib/analytics'

export function PreSignupClientPage() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    trackEvent('form_submit', {
      form_name: 'pre_signup_client',
      role: 'client',
    })
    setSubmitted(true)
  }

  return (
    <>
      <PageMeta
        description="Pré-inscription client Upper Glam pour être informé du lancement."
        title="Pre-inscription Client(e)"
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Card className="space-y-5">
            <div className="space-y-3">
              <Badge>Pre-inscription</Badge>
              <h1 className="text-4xl sm:text-5xl">
                Rejoignez la liste d attente Client(e)
              </h1>
              <p className="text-sm leading-relaxed text-[var(--ug-muted)]">
                Laissez vos informations pour etre informe(e) de l'ouverture
                complete du service.
              </p>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              <Input label="Nom" name="name" placeholder="Votre nom" required />
              <Input
                label="Email"
                name="email"
                placeholder="vous@exemple.com"
                required
                type="email"
              />
              <Input
                label="Ville"
                name="city"
                placeholder="Votre ville"
                required
              />
              <Input
                label="Numero de telephone"
                name="phone"
                placeholder="06 00 00 00 00"
                required
                type="tel"
              />
              <Input
                label="Code postal"
                name="postal_code"
                placeholder="75000"
                required
              />
              <Textarea
                label="Besoin principal"
                name="need"
                placeholder="Ex: maquillage evenementiel, coiffure..."
              />
              <label className="flex items-start gap-3 rounded-xl border border-[var(--ug-border)] bg-[var(--ug-surface)] p-3 text-sm text-[var(--ug-muted)]">
                <input
                  className="mt-1"
                  name="consent"
                  required
                  type="checkbox"
                />
                <span className="leading-relaxed">
                  <strong>
                    J accepte que mes donnees personnelles soient collectees et
                    traitees par Upper Glam conformement a sa Politique de
                    Confidentialite.
                  </strong>{' '}
                  Les informations recueillies via ce formulaire sont
                  enregistrees par Upper Glam afin de fournir nos services,
                  faciliter la mise en relation et ameliorer votre experience.
                  Vous pouvez exercer vos droits d acces, de rectification, d
                  opposition ou de suppression en nous contactant a
                  contact.upperglam@gmail.com. Consultez notre{' '}
                  <Link
                    className="text-[var(--ug-accent)] underline"
                    to="/privacy"
                  >
                    Politique de Confidentialite
                  </Link>
                  .
                </span>
              </label>
              <Button size="lg" type="submit">
                Je me pre-inscris
              </Button>
            </form>
            {submitted && (
              <p className="text-sm text-[var(--ug-accent)]">
                Merci, votre pre-inscription client a bien ete prise en compte.
              </p>
            )}
          </Card>
        </div>
      </Section>
    </>
  )
}
