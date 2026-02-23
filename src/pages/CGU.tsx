import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function CGUPage() {
  return (
    <>
      <PageMeta
        description="Conditions generales d utilisation Upper Glam - regles de la plateforme pour clients et professionnels."
        title="CGU"
      />
      <Section>
        <div className="space-y-6">
          <Badge>CGU</Badge>
          <Card className="space-y-4 text-sm text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">
              Conditions generales d utilisation
            </h1>
            <h2 className="text-xl text-[var(--ug-text)]">1. Objet</h2>
            <p>
              Contenu placeholder a completer selon le modele economique final.
            </p>
            <h2 className="text-xl text-[var(--ug-text)]">
              2. Comptes utilisateurs
            </h2>
            <p>Contenu placeholder: creation, securite, responsabilites.</p>
            <h2 className="text-xl text-[var(--ug-text)]">
              3. Prestations et paiement
            </h2>
            <p>
              Contenu placeholder: conditions de reservation, annulation,
              litiges.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
