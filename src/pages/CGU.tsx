import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function CGUPage() {
  return (
    <>
      <PageMeta
        description="Conditions générales d'utilisation du site Upper Glam et de son service de pré-inscription."
        noindex
        title="Conditions générales d'utilisation"
      />
      <Section>
        <div className="space-y-6">
          <Badge>CGU</Badge>
          <Card className="space-y-4 text-sm leading-relaxed text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">
              Conditions générales d'utilisation
            </h1>
            <p>Dernière mise à jour : 1er août 2026.</p>

            <h2 className="text-xl text-[var(--ug-text)]">1. Objet</h2>
            <p>
              Ces conditions encadrent l'accès au site Upper Glam et à son
              formulaire de pré-inscription. Pendant la phase de lancement, une
              pré-inscription ne constitue ni une réservation ni une garantie
              d'accès immédiat à la future plateforme.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              2. Utilisation du site
            </h2>
            <p>
              Vous vous engagez à transmettre des informations exactes, à ne pas
              perturber le fonctionnement du site et à ne pas utiliser son
              contenu à des fins illicites, trompeuses ou frauduleuses.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              3. Pré-inscriptions
            </h2>
            <p>
              Upper Glam peut contacter les personnes pré-inscrites au sujet du
              lancement et de leur demande. Une demande peut être refusée ou
              mise en attente si elle est incomplète, incohérente ou
              incompatible avec le périmètre du service.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              4. Prestations et paiements
            </h2>
            <p>
              Les règles détaillées de réservation, paiement, annulation,
              remboursement et règlement des litiges seront présentées avant la
              première réservation et devront être acceptées séparément.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              5. Contenus des professionnels
            </h2>
            <p>
              Chaque professionnel est responsable de l'exactitude de son
              identité, de ses qualifications, de ses tarifs, de ses photos et
              de ses disponibilités. Upper Glam peut demander des justificatifs
              et retirer un contenu manifestement illicite ou trompeur.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              6. Données personnelles
            </h2>
            <p>
              Le traitement des données personnelles est décrit dans la
              politique de confidentialité. Les préférences de mesure d'audience
              peuvent être modifiées depuis le pied de page.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              7. Modification des conditions
            </h2>
            <p>
              Ces conditions peuvent évoluer avec le service. La version
              applicable et sa date sont publiées sur cette page.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
