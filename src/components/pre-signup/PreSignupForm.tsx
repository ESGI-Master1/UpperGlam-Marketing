import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input, Textarea } from '../ui/Input'
import { useApi } from '../../hooks/useApi'
import { trackEvent } from '../../lib/analytics'

type PreSignupRole = 'provider' | 'user'

type ServiceMode = 'home' | 'institute'

type ProviderProfilePayload = {
  displayName: string
  priceFromCents?: number
  serviceModes?: ServiceMode[]
  specialties?: string[]
}

type PreSignupPayload = {
  city: string
  comment?: string
  desiredServices?: string[]
  email: string
  firstName: string
  interest?: string
  marketingOptIn?: boolean
  password: string
  phone: string
  preferredBudgetCents?: number
  preferredServiceModes?: ServiceMode[]
  providerProfile?: ProviderProfilePayload
  role: PreSignupRole
  source: string
  username?: string
  lastName: string
  zipcode: string
}

type PreSignupFormProps = {
  ctaLabel: string
  intro: string
  role: PreSignupRole
  title: string
  trackingFormName: 'pre_signup_client' | 'pre_signup_pro'
}

function getTrimmedValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ''
}

function parsePositiveCents(value: string) {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined
  }

  return Math.round(parsed * 100)
}

function parseCsv(value: string) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseServiceModes(values: FormDataEntryValue[]) {
  return values.filter(
    (value): value is ServiceMode => value === 'home' || value === 'institute'
  )
}

export function PreSignupForm({
  ctaLabel,
  intro,
  role,
  title,
  trackingFormName,
}: PreSignupFormProps) {
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { error, isLoading, request } = useApi()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)
    const formData = new FormData(event.currentTarget)
    const interest = getTrimmedValue(formData, 'interest')
    const comment = getTrimmedValue(formData, 'comment')
    const firstName = getTrimmedValue(formData, 'firstName')
    const lastName = getTrimmedValue(formData, 'lastName')
    const displayName = getTrimmedValue(formData, 'providerDisplayName')
    const desiredServices = parseCsv(
      getTrimmedValue(formData, 'desiredServices')
    )
    const specialties = parseCsv(
      getTrimmedValue(formData, 'providerSpecialties')
    )
    const preferredServiceModes = parseServiceModes(
      formData.getAll('preferredServiceModes')
    )
    const providerServiceModes = parseServiceModes(
      formData.getAll('providerServiceModes')
    )
    const preferredBudgetCents = parsePositiveCents(
      getTrimmedValue(formData, 'preferredBudgetEuros')
    )
    const providerPriceFromCents = parsePositiveCents(
      getTrimmedValue(formData, 'providerPriceFromEuros')
    )
    const marketingOptIn = formData.get('marketingOptIn') === 'on'

    if (!firstName || !lastName) {
      setLocalError('Le prenom et le nom sont obligatoires.')
      return
    }

    if (role === 'provider' && !displayName) {
      setLocalError('Le nom public est obligatoire pour un prestataire.')
      return
    }

    const payload: PreSignupPayload = {
      city: getTrimmedValue(formData, 'city'),
      email: getTrimmedValue(formData, 'email'),
      firstName,
      password: formData.get('password')?.toString() ?? '',
      phone: getTrimmedValue(formData, 'phone'),
      role,
      source: 'marketing_website',
      lastName,
      zipcode: getTrimmedValue(formData, 'zipcode'),
      ...(interest ? { interest } : {}),
      ...(comment ? { comment } : {}),
      ...(marketingOptIn ? { marketingOptIn: true } : {}),
      ...(desiredServices.length ? { desiredServices } : {}),
      ...(preferredServiceModes.length ? { preferredServiceModes } : {}),
      ...(preferredBudgetCents ? { preferredBudgetCents } : {}),
      ...(role === 'provider'
        ? {
            providerProfile: {
              displayName,
              ...(providerServiceModes.length
                ? { serviceModes: providerServiceModes }
                : {}),
              ...(specialties.length ? { specialties } : {}),
              ...(providerPriceFromCents
                ? { priceFromCents: providerPriceFromCents }
                : {}),
            },
          }
        : {}),
    }

    try {
      await request('/pre-registration', {
        body: payload,
        method: 'POST',
      })
      trackEvent('form_submit', {
        form_name: trackingFormName,
        role,
      })
      event.currentTarget.reset()
      setSuccessMessage('Pre-inscription envoyee avec succes.')
    } catch {
      setSuccessMessage(null)
    }
  }

  return (
    <Card className="space-y-5">
      <div className="space-y-3">
        <Badge>Pre-inscription</Badge>
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <p className="text-sm leading-relaxed text-(--ug-muted)">{intro}</p>
        <p className="text-xs text-(--ug-muted)">
          Formulaire rapide: 2 minutes environ.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {successMessage && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoComplete="given-name"
            label="Prenom"
            maxLength={120}
            name="firstName"
            placeholder="Ex: Lea"
            required
          />
          <Input
            autoComplete="family-name"
            label="Nom"
            maxLength={120}
            name="lastName"
            placeholder="Ex: Martin"
            required
          />
          {role === 'provider' && (
            <Input
              label="Nom public / enseigne"
              maxLength={150}
              minLength={2}
              name="providerDisplayName"
              placeholder="Ex: Sarah Glam Studio"
              required
            />
          )}
          <Input
            autoComplete="email"
            label="Email"
            name="email"
            placeholder="vous@exemple.com"
            required
            type="email"
          />
          <Input
            label="Mot de passe"
            maxLength={255}
            minLength={8}
            name="password"
            placeholder="Minimum 8 caracteres"
            required
            type="password"
          />
          <Input
            autoComplete="tel"
            label="Telephone"
            maxLength={30}
            minLength={6}
            name="phone"
            placeholder="06 00 00 00 00"
            required
            type="tel"
          />
          <Input
            autoComplete="address-level2"
            label="Ville"
            maxLength={120}
            minLength={2}
            name="city"
            placeholder="Paris"
            required
          />
          <Input
            autoComplete="postal-code"
            inputMode="numeric"
            label="Code postal"
            maxLength={20}
            minLength={2}
            name="zipcode"
            placeholder="75011"
            required
          />
        </div>

        {role === 'user' && (
          <>
            <Input
              label="Services recherches (optionnel)"
              name="desiredServices"
              placeholder="Ex: coiffure, maquillage"
            />
            <div className="space-y-2">
              <p className="text-sm text-[var(--ug-muted)]">
                Mode prefere (optionnel)
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--ug-muted)]">
                <label className="inline-flex items-center gap-2">
                  <input
                    name="preferredServiceModes"
                    type="checkbox"
                    value="home"
                  />
                  A domicile
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    name="preferredServiceModes"
                    type="checkbox"
                    value="institute"
                  />
                  En institut
                </label>
              </div>
            </div>
            <Input
              inputMode="numeric"
              label="Budget prefere en euros (optionnel)"
              min={1}
              name="preferredBudgetEuros"
              placeholder="Ex: 70"
              step="1"
              type="number"
            />
          </>
        )}

        {role === 'provider' && (
          <>
            <Input
              label="Specialites (optionnel)"
              name="providerSpecialties"
              placeholder="Ex: coiffure, maquillage"
            />
            <div className="space-y-2">
              <p className="text-sm text-[var(--ug-muted)]">
                Modes de prestation (optionnel)
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--ug-muted)]">
                <label className="inline-flex items-center gap-2">
                  <input
                    name="providerServiceModes"
                    type="checkbox"
                    value="home"
                  />
                  A domicile
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    name="providerServiceModes"
                    type="checkbox"
                    value="institute"
                  />
                  En institut
                </label>
              </div>
            </div>
            <Input
              inputMode="numeric"
              label="Prix de depart en euros (optionnel)"
              min={1}
              name="providerPriceFromEuros"
              placeholder="Ex: 65"
              step="1"
              type="number"
            />
          </>
        )}

        <Textarea
          label="Ce que vous recherchez (optionnel)"
          maxLength={2000}
          name="interest"
          placeholder="Donnez un peu de contexte sur votre besoin."
        />

        <Textarea
          label="Message (optionnel)"
          maxLength={5000}
          name="comment"
          placeholder="Ajoutez un detail utile si besoin."
        />

        <label className="flex items-start gap-3 rounded-xl border border-(--ug-border) bg-(--ug-surface) p-3 text-sm text-(--ug-muted)">
          <input className="mt-1" name="marketingOptIn" type="checkbox" />
          <span className="leading-relaxed">
            Je souhaite recevoir les informations de lancement Upper Glam.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-(--ug-border) bg-(--ug-surface) p-3 text-sm text-(--ug-muted)">
          <input className="mt-1" name="consent" required type="checkbox" />
          <span className="leading-relaxed">
            J accepte le traitement de mes donnees selon la{' '}
            <Link className="text-(--ug-accent) underline" to="/privacy">
              Politique de Confidentialite
            </Link>
            .
          </span>
        </label>

        <Button className="w-full" disabled={isLoading} size="lg" type="submit">
          {isLoading ? 'Envoi en cours...' : ctaLabel}
        </Button>
        {(localError || error) && (
          <p className="text-sm text-red-600">{localError ?? error}</p>
        )}
      </form>
    </Card>
  )
}
