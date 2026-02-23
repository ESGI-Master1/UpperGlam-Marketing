import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function PrivacyPage() {
  return (
    <>
      <PageMeta
        description="Politique de Confidentialite Upper Glam - RGPD, finalites de traitement, conservation et droits utilisateurs."
        title="Politique de confidentialite"
      />
      <Section>
        <div className="space-y-6">
          <Badge>Confidentialite</Badge>
          <Card className="space-y-3 text-sm leading-relaxed text-[var(--ug-muted)]">
            <h1 className="text-3xl text-[var(--ug-text)]">
              Politique de Confidentialite - Upper Glam
            </h1>
            <p>Derniere mise a jour : 03/04/2025</p>
            <p>
              Chez Upper Glam, la protection de vos donnees personnelles est une
              priorite. Nous nous engageons a respecter votre vie privee et a
              assurer la securite de vos informations conformement au RGPD et
              aux lois en vigueur.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              1. Qui sommes-nous ?
            </h2>
            <p>
              Upper Glam est une application facilitant la mise en relation
              entre clients et professionnels de la beaute. L'entite responsable
              du traitement des donnees est Pauline Lavergne, immatriculee sous
              le numero [Numero SIRET], dont le siege social est situe a
              [Adresse].
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              2. Quelles donnees collectons-nous ?
            </h2>
            <p>
              Donnees d identification : nom, prenom, adresse e-mail, numero de
              telephone, photo de profil.
            </p>
            <p>
              Donnees de connexion : adresse IP, type de navigateur, logs de
              connexion.
            </p>
            <p>
              Donnees de paiement (via des prestataires securises) :
              informations bancaires pour les transactions.
            </p>
            <p>
              Donnees de navigation : pages visitees, preferences d utilisation.
            </p>
            <p>
              Donnees professionnelles (pour les prestataires) : diplomes,
              experiences, disponibilites, localisation.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              3. Pourquoi collectons-nous ces donnees ?
            </h2>
            <p>
              Fournir nos services : creation et gestion de comptes, mise en
              relation, reservations.
            </p>
            <p>
              Personnaliser votre experience : recommandations, preferences.
            </p>
            <p>
              Securiser la plateforme : lutte contre la fraude, confidentialite.
            </p>
            <p>
              Envoyer des communications : notifications de reservation, offres
              promotionnelles (avec consentement).
            </p>
            <p>
              Respecter nos obligations legales : conservation conforme a la
              loi.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              4. Qui a acces a vos donnees ?
            </h2>
            <p>
              Vos donnees sont accessibles uniquement aux equipes Upper Glam et
              a nos prestataires techniques (hebergement, paiement) pour
              executer le service. Nous ne vendons pas vos donnees.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              5. Combien de temps conservons-nous vos donnees ?
            </h2>
            <p>Donnees du compte : jusqu a la suppression du compte.</p>
            <p>Donnees de transaction : 5 ans pour obligations legales.</p>
            <p>Donnees marketing : jusqu au retrait du consentement.</p>

            <h2 className="text-xl text-[var(--ug-text)]">
              6. Quels sont vos droits ?
            </h2>
            <p>
              Droit d acces, de rectification, d effacement, d opposition, a la
              portabilite et a la limitation du traitement.
            </p>
            <p>
              Vous pouvez exercer ces droits en nous contactant a :
              contact.upperglam@gmail.com
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              7. Comment securisons-nous vos donnees ?
            </h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles
              strictes : chiffrement, acces restreint, audits de securite.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              8. Cookies et technologies similaires
            </h2>
            <p>
              Nous utilisons des cookies pour ameliorer votre experience. Vous
              pouvez gerer vos preferences dans les parametres de votre
              navigateur.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">
              9. Modifications de la politique
            </h2>
            <p>
              Nous pouvons modifier cette politique pour nous conformer aux
              evolutions legales ou ameliorer nos services.
            </p>

            <h2 className="text-xl text-[var(--ug-text)]">10. Contact</h2>
            <p>
              Pour toute question concernant vos donnees personnelles :
              contact.upperglam@gmail.com
            </p>
            <p>
              En utilisant Upper Glam, vous acceptez cette politique de
              confidentialite. Merci de votre confiance.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
