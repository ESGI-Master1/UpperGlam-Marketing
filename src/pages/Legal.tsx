import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function LegalPage() {
  return (
    <>
      <PageMeta
        description="Mentions legales Upper Glam - informations editeur, hebergement et responsabilites."
        title="Mentions legales"
      />
      <Section>
        <div className="space-y-6">
          <Badge>Mentions legales</Badge>
          <Card className="space-y-4 text-sm text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">Mentions legales</h1>
            <h2 className="text-xl text-[var(--ug-text)]">1. Editeur</h2>
            <p>
              Contenu placeholder a completer (raison sociale, SIRET, adresse).
            </p>
            <h2 className="text-xl text-[var(--ug-text)]">2. Hebergement</h2>
            <p>Contenu placeholder a completer (nom hebergeur, adresse).</p>
            <h2 className="text-xl text-[var(--ug-text)]">3. Responsabilite</h2>
            <p>Contenu placeholder a completer selon votre contexte legal.</p>
          </Card>
        </div>
      </Section>
    </>
  )
}
