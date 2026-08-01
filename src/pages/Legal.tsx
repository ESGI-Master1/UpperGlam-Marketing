import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { siteCopy } from '../content/copy'

export function LegalPage() {
  return (
    <>
      <PageMeta
        description="Mentions légales d'Upper Glam : éditeur, publication, hébergement et propriété intellectuelle."
        noindex
        title="Mentions légales"
      />
      <Section>
        <div className="space-y-6">
          <Badge>Mentions légales</Badge>
          <Card className="space-y-4 text-sm leading-relaxed text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">Mentions légales</h1>
            <p>Dernière mise à jour : 1er août 2026.</p>

            <h2 className="text-xl text-[var(--ug-text)]">1. Édition</h2>
            <p>
              Le site Upper Glam est édité par Pauline Lavergne, responsable du
              projet Upper Glam. Contact :{' '}
              <a className="underline" href={`mailto:${siteCopy.email}`}>
                {siteCopy.email}
              </a>
              .
            </p>
            <p>
              Directrice de la publication : Pauline Lavergne. Les informations
              d'immatriculation, le siège et l'identité complète de l'hébergeur
              doivent être ajoutés ici avant l'ouverture commerciale du service.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">2. Hébergement</h2>
            <p>
              L'infrastructure est administrée pour le compte d'Upper Glam. Pour
              toute question technique, de sécurité ou demande relative à un
              contenu, utilisez l'adresse de contact indiquée ci-dessus.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              3. Propriété intellectuelle
            </h2>
            <p>
              La marque, les textes, éléments graphiques, interfaces et contenus
              du site sont protégés. Toute reproduction ou adaptation sans
              autorisation préalable est interdite, hors exceptions prévues par
              la loi.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">4. Responsabilité</h2>
            <p>
              Upper Glam s'efforce de fournir des informations exactes et un
              service disponible. Le site de présentation peut néanmoins être
              modifié pendant sa phase de lancement. Les professionnels restent
              responsables des informations et prestations qu'ils proposent.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
