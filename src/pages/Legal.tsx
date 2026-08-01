import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function LegalPage() {
  return (
    <>
      <PageMeta
        description="Mentions légales et informations éditoriales du service Upper Glam."
        noIndex
        title="Mentions légales"
      />
      <Section>
        <div className="space-y-6">
          <Badge>Informations légales</Badge>
          <Card className="space-y-4 text-sm text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">Mentions légales</h1>
            <h2 className="text-xl text-[var(--ug-text)]">1. Éditeur</h2>
            <p>
              Le service est édité par l’équipe Upper Glam. Contact :
              contact.upperglam@gmail.com.
            </p>
            <h2 className="text-xl text-[var(--ug-text)]">2. Contenus</h2>
            <p>
              Les textes, éléments graphiques, marques et interfaces présentés
              sur ce service sont protégés. Toute reproduction non autorisée est
              interdite.
            </p>
            <h2 className="text-xl text-[var(--ug-text)]">3. Responsabilité</h2>
            <p>
              Upper Glam veille à fournir des informations accessibles et à
              jour. Une indisponibilité temporaire ou une erreur peut être
              signalée à l’adresse de contact ci-dessus.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
