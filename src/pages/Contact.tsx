import { useState } from 'react'
import type { FormEvent } from 'react'
import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Section } from '../components/ui/Section'
import { siteCopy } from '../content/copy'
import { trackEvent } from '../lib/analytics'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const role = String(formData.get('role') ?? 'unknown')

    trackEvent('form_submit', {
      form_name: 'contact',
      role,
    })

    setSubmitted(true)
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
              <Input label="Nom" name="name" placeholder="Votre nom" required />
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
            {submitted && (
              <p className="text-sm text-[var(--ug-accent)]">
                Message recu (UI MVP). Le branchement email viendra ensuite.
              </p>
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-2xl">Informations</h2>
            <p className="text-sm text-[var(--ug-muted)]">
              Email:{' '}
              <span className="text-[var(--ug-text)]">{siteCopy.email}</span>
            </p>
            <p className="text-sm text-[var(--ug-muted)]">
              Instagram:{' '}
              <a
                className="text-[var(--ug-accent)] hover:text-[var(--ug-accent-hover)]"
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
