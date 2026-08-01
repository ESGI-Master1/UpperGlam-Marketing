import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { AppMockup } from '../components/marketing/AppMockup'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { trackEvent } from '../lib/analytics'

const benefits = [
  {
    title: 'Des profils comparables',
    text: 'Spécialités, réalisations, prix et modalités réunis avant de choisir.',
  },
  {
    title: 'Des créneaux visibles',
    text: 'La disponibilité devient une information de recherche, pas une discussion supplémentaire.',
  },
  {
    title: 'Une confirmation claire',
    text: 'Le rendez-vous, le lieu et le montant restent lisibles jusqu’au paiement.',
  },
]

export function ClientPage() {
  return (
    <>
      <PageMeta
        description="Trouvez un professionnel de la beauté, comparez ses prestations et réservez un créneau disponible avec Upper Glam."
        title="Trouver et réserver une prestation beauté"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-7">
            <Badge>Parcours client</Badge>
            <h1 className="text-5xl leading-tight sm:text-6xl">
              Trouver un professionnel disponible, sans multiplier les messages
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-[var(--ug-muted)]">
              Upper Glam transforme une recherche beauté en réservation
              structurée, avec les informations utiles au même endroit.
            </p>
            <Link
              className={buttonClasses('primary', 'lg')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'client_signup',
                  funnel_name: 'pre_signup',
                  funnel_step: 'cta_click',
                  location: 'client_page',
                  target_role: 'user',
                  to: '/pre-inscription?role=user',
                })
              }
              to="/pre-inscription?role=user"
            >
              Créer mon profil client
            </Link>
          </div>
          <AppMockup compact />
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 border-t border-[var(--ug-border)] pt-10 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article className="process-step" key={benefit.title}>
              <span className="text-sm text-[var(--ug-accent)]">
                0{index + 1}
              </span>
              <h2 className="mt-5 text-2xl">{benefit.title}</h2>
              <p className="mt-3 leading-relaxed text-[var(--ug-muted)]">
                {benefit.text}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <div className="final-cta">
          <Badge>Cas d’usage</Badge>
          <h2>
            Un rendez-vous en institut ou à domicile, pour le quotidien comme
            l’événementiel.
          </h2>
          <p>
            Coiffure, maquillage, onglerie, soins ou préparation d’un événement
            : le même parcours conserve les informations essentielles.
          </p>
        </div>
      </Section>
    </>
  )
}
