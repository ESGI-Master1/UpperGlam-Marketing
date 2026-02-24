import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Section } from '../components/ui/Section'
import { useApi } from '../hooks/useApi'
import { trackEvent } from '../lib/analytics'

type PreSignupPayload = {
  city: string
  comment?: string
  email: string
  interest?: string
  password: string
  phone: string
  role: 'provider' | 'user'
  username: string
  zipcode: string
}

export function PreSignupProPage() {
  const [commentLength, setCommentLength] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const { error, isLoading, request } = useApi()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const interest = formData.get('interest')?.toString().trim()
    const comment = formData.get('comment')?.toString().trim()

    const payload: PreSignupPayload = {
      city: formData.get('city')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      password: formData.get('password')?.toString() ?? '',
      phone: formData.get('phone')?.toString().trim() ?? '',
      role: 'provider',
      username: formData.get('username')?.toString().trim() ?? '',
      zipcode: formData.get('zipcode')?.toString().trim() ?? '',
      ...(interest ? { interest } : {}),
      ...(comment ? { comment } : {}),
    }

    try {
      await request('/pre-registration', {
        body: payload,
        method: 'POST',
      })
      trackEvent('form_submit', {
        form_name: 'pre_signup_pro',
        role: 'provider',
      })
      setSubmitted(true)
      setCommentLength(0)
      event.currentTarget.reset()
    } catch {
      setSubmitted(false)
    }
  }

  return (
    <>
      <PageMeta
        description="Pré-inscription professionnel(le) Upper Glam pour rejoindre le lancement."
        title="Pre-inscription Professionnel(le)"
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Card className="space-y-5">
            <div className="space-y-3">
              <Badge>Pre-inscription</Badge>
              <h1 className="text-4xl sm:text-5xl">
                Rejoignez la liste d attente Pro
              </h1>
              <p className="text-sm leading-relaxed text-[var(--ug-muted)]">
                Decrivez votre activite pour etre prioritaire lors de l
                ouverture du service professionnel.
              </p>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              <Input
                label="Nom d utilisateur / Marque"
                name="username"
                placeholder="Votre nom ou marque"
                required
              />
              <Input
                label="Email"
                name="email"
                placeholder="vous@exemple.com"
                required
                type="email"
              />
              <Input
                label="Mot de passe"
                minLength={8}
                name="password"
                placeholder="Minimum 8 caracteres"
                required
                type="password"
              />
              <Input
                label="Ville"
                name="city"
                placeholder="Votre ville"
                required
              />
              <Input
                label="Specialite"
                name="interest"
                placeholder="Ex: coiffure, make-up..."
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
                name="zipcode"
                placeholder="75000"
                required
              />
              <Textarea
                label="Presentation courte"
                maxLength={500}
                name="comment"
                onChange={(event) =>
                  setCommentLength(event.target.value.length)
                }
                placeholder="Parlez de votre activite..."
              />
              <p className="text-right text-xs text-[var(--ug-muted)]">
                {commentLength}/500
              </p>
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
              <Button disabled={isLoading} size="lg" type="submit">
                {isLoading
                  ? 'Envoi en cours...'
                  : 'Je me pre-inscris en tant que pro'}
              </Button>
            </form>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {submitted && (
              <p className="text-sm text-[var(--ug-accent)]">
                Merci, votre pre-inscription pro a bien ete prise en compte.
              </p>
            )}
          </Card>
        </div>
      </Section>
    </>
  )
}
