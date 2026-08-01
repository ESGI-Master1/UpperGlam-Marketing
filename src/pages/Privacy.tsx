import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { siteCopy } from '../content/copy'

export function PrivacyPage() {
  return (
    <>
      <PageMeta
        description="Politique de confidentialité Upper Glam : données collectées, finalités, conservation, destinataires et droits RGPD."
        noindex
        title="Politique de confidentialité"
      />
      <Section>
        <div className="space-y-6">
          <Badge>Confidentialité</Badge>
          <Card className="space-y-4 text-sm leading-relaxed text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">
              Politique de confidentialité
            </h1>
            <p>Dernière mise à jour : 1er août 2026.</p>

            <h2 className="text-xl text-[var(--ug-text)]">
              1. Responsable du traitement
            </h2>
            <p>
              Pauline Lavergne, responsable du projet Upper Glam, détermine les
              finalités et moyens des traitements décrits ici. Elle est
              joignable à{' '}
              <a className="underline" href={`mailto:${siteCopy.email}`}>
                {siteCopy.email}
              </a>
              . Les informations d'immatriculation et l'adresse du siège doivent
              être complétées avant l'ouverture commerciale.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              2. Données traitées
            </h2>
            <p>
              Selon votre parcours, Upper Glam traite vos coordonnées, votre
              rôle client ou professionnel, votre zone, vos besoins, les
              informations de profil professionnel, les échanges avec le support
              ainsi que des données techniques de connexion et de sécurité.
            </p>
            <p>
              Les données de paiement seront traitées par un prestataire de
              paiement sécurisé. Upper Glam n'a pas vocation à conserver les
              numéros complets de carte bancaire.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              3. Finalités et bases légales
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                gérer les pré-inscriptions et demandes : mesures
                précontractuelles ;
              </li>
              <li>
                fournir les comptes, réservations et paiements : exécution du
                contrat ;
              </li>
              <li>
                sécuriser le service et prévenir la fraude : intérêt légitime ;
              </li>
              <li>
                respecter les obligations comptables et légales : obligation
                légale ;
              </li>
              <li>
                mesurer l'audience non essentielle et envoyer des communications
                commerciales : consentement, révocable à tout moment.
              </li>
            </ul>

            <h2 className="text-xl text-[var(--ug-text)]">
              4. Destinataires et sous-traitants
            </h2>
            <p>
              Seules les personnes habilitées d'Upper Glam et les prestataires
              nécessaires à l'hébergement, l'envoi d'e-mails, la mesure
              d'audience, le stockage et le paiement accèdent aux données, dans
              la limite de leurs missions. Upper Glam ne vend pas vos données.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              5. Transferts hors Espace économique européen
            </h2>
            <p>
              Si un prestataire traite des données hors de l'Espace économique
              européen, Upper Glam vérifie l'existence d'un mécanisme reconnu,
              notamment une décision d'adéquation ou des clauses contractuelles
              types, et met en place les garanties appropriées.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              6. Durées de conservation
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>pré-inscriptions : trois ans après le dernier contact ;</li>
              <li>
                compte actif : pendant la relation, puis délais légaux
                applicables ;
              </li>
              <li>facturation et transactions : durée imposée par la loi ;</li>
              <li>
                prospection : trois ans après le dernier contact ou jusqu'au
                retrait ;
              </li>
              <li>
                choix de consentement : durée nécessaire pour prouver ce choix.
              </li>
            </ul>

            <h2 className="text-xl text-[var(--ug-text)]">7. Vos droits</h2>
            <p>
              Vous pouvez demander l'accès, la rectification, l'effacement, la
              limitation, la portabilité ou vous opposer à un traitement. Vous
              pouvez retirer votre consentement à tout moment, sans remettre en
              cause les traitements antérieurs.
            </p>
            <p>
              Envoyez votre demande à{' '}
              <a className="underline" href={`mailto:${siteCopy.email}`}>
                {siteCopy.email}
              </a>
              . Une preuve d'identité peut être demandée uniquement en cas de
              doute raisonnable. Vous pouvez également déposer une réclamation
              auprès de la{' '}
              <a
                className="underline"
                href="https://www.cnil.fr/fr/plaintes"
                rel="noreferrer"
                target="_blank"
              >
                CNIL
              </a>
              .
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              8. Cookies et mesure d'audience
            </h2>
            <p>
              Les cookies strictement nécessaires fonctionnent sans
              consentement. La mesure d'audience reste désactivée tant que vous
              ne l'acceptez pas. Votre choix peut être modifié via « Gérer mes
              cookies » dans le pied de page.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">9. Sécurité</h2>
            <p>
              Upper Glam applique des mesures proportionnées aux risques : accès
              restreints, chiffrement des échanges, journalisation, sauvegardes
              et contrôle des droits administrateurs.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
