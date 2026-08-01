import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function CGUPage() {
  return (
    <>
      <PageMeta
        description="Conditions générales d’utilisation du service Upper Glam."
        noIndex
        title="Conditions générales d’utilisation"
      />
      <Section>
        <div className="space-y-6">
          <Badge>Conditions d’utilisation</Badge>
          <Card className="space-y-4 text-sm text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">
              Conditions générales d’utilisation
            </h1>
            <h2 className="text-xl text-[var(--ug-text)]">1. Objet</h2>
            <p>
              Upper Glam met en relation des clients et des professionnels de la
              beauté, facilite la consultation des disponibilités et organise le
              parcours de réservation.
            </p>
            <h2 className="text-xl text-[var(--ug-text)]">
              2. Comptes utilisateurs
            </h2>
            <p>
              Chaque utilisateur fournit des informations exactes, protège ses
              identifiants et signale rapidement toute utilisation non autorisée
              de son compte.
            </p>
            <h2 className="text-xl text-[var(--ug-text)]">
              3. Prestations et paiement
            </h2>
            <p>
              Le détail de la prestation, le créneau, le lieu et le montant sont
              présentés avant validation. Les conditions propres au
              professionnel restent consultables dans son profil et le
              récapitulatif.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
