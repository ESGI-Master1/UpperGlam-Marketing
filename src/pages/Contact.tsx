import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { siteCopy } from '../content/copy'
import { trackEvent } from '../lib/analytics'

export function ContactPage() {
  const [preparedEmail, setPreparedEmail] = useState<string | null>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const role = String(formData.get('role') ?? 'unknown')
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const message = String(formData.get('message') ?? '')

    trackEvent('form_submit', {
      form_name: 'contact',
      role,
    })

    const subject = encodeURIComponent(`Contact Upper Glam — ${role}`)
    const body = encodeURIComponent(
      `Nom : ${name}\nE-mail : ${email}\nProfil : ${role}\n\n${message}`
    )
    setPreparedEmail(`mailto:${siteCopy.email}?subject=${subject}&body=${body}`)
  }

  return (
    <>
      <PageMeta
        description="Contactez Upper Glam pour rejoindre la plateforme en tant que client(e) ou professionnel(le)."
        title="Contact"
      />
      <Section>
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Card className="space-y-5">
            <div className="space-y-3">
              <Badge>Contact</Badge>
              <h1 className="text-4xl sm:text-5xl">Parlons de votre besoin</h1>
            </div>
            {!preparedEmail ? (
              <form className="space-y-4" onSubmit={onSubmit}>
                <Select
                  defaultValue="client"
                  label="Profil"
                  name="role"
                  options={[
                    { label: 'Client(e)', value: 'client' },
                    { label: 'Professionnel(le)', value: 'pro' },
                  ]}
                />
                <Input
                  label="Nom"
                  name="name"
                  placeholder="Votre nom"
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  placeholder="vous@exemple.com"
                  required
                  type="email"
                />
                <Textarea
                  label="Message"
                  name="message"
                  placeholder="Expliquez votre besoin..."
                  required
                />
                <Button size="lg" type="submit">
                  Envoyer
                </Button>
              </form>
            ) : (
              <div className="space-y-4 rounded-xl border border-(--ug-accent) bg-(--ug-accent)/5 p-6 text-center">
                <p className="text-lg font-medium text-(--ug-accent)">
                  Votre message est prêt
                </p>
                <p className="text-sm text-(--ug-muted)">
                  Le formulaire n'envoie aucune donnée sans votre action. Ouvrez
                  votre messagerie pour vérifier et envoyer l'e-mail à l'équipe
                  Upper Glam.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a className={buttonClasses('primary')} href={preparedEmail}>
                    Ouvrir ma messagerie
                  </a>
                  <Link className={buttonClasses('secondary')} to="/">
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-2xl">Informations</h2>
            <p className="text-sm text-(--ug-muted)">
              Email: <span className="text-(--ug-text)">{siteCopy.email}</span>
            </p>
            <p className="text-sm text-(--ug-muted)">
              Instagram:{' '}
              <a
                className="text-(--ug-accent) hover:text-(--ug-accent-hover)"
                href={siteCopy.instagramUrl}
                onClick={() =>
                  trackEvent('outbound_click', {
                    destination: siteCopy.instagramUrl,
                    location: 'contact_page',
                    type: 'instagram',
                  })
                }
                rel="noreferrer"
                target="_blank"
              >
                {siteCopy.instagramHandle}
              </a>
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
