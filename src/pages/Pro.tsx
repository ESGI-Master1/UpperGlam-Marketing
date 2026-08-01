import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { trackEvent } from '../lib/analytics'

const benefits = [
  {
    title: 'Présenter son savoir-faire',
    text: 'Un profil structuré réunit spécialités, réalisations, lieux et tarifs.',
  },
  {
    title: 'Piloter ses disponibilités',
    text: 'L’agenda distingue créneaux libres, rendez-vous et fermetures exceptionnelles.',
  },
  {
    title: 'Centraliser les demandes',
    text: 'Chaque réservation conserve son statut et les informations nécessaires au suivi.',
  },
]

export function ProPage() {
  return (
    <>
      <PageMeta
        description="Présentez vos prestations beauté, gérez vos disponibilités et centralisez vos réservations avec Upper Glam."
        title="Agenda et réservations pour professionnels de la beauté"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="max-w-4xl space-y-7">
          <Badge>Espace professionnel</Badge>
          <h1 className="text-5xl leading-tight sm:text-6xl">
            Transformer sa visibilité en rendez-vous réellement organisés
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-[var(--ug-muted)]">
            Upper Glam aide les professionnels de la beauté à présenter leur
            offre, ouvrir leurs créneaux et suivre les demandes dans un seul
            espace.
          </p>
          <Link
            className={buttonClasses('primary', 'lg')}
            onClick={() =>
              trackEvent('cta_click', {
                cta: 'pro_signup',
                funnel_name: 'pre_signup',
                funnel_step: 'cta_click',
                location: 'pro_page',
                target_role: 'provider',
                to: '/pre-inscription?role=provider',
              })
            }
            to="/pre-inscription?role=provider"
          >
            Présenter mon activité
          </Link>
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
          <Badge>Conçu pour le terrain</Badge>
          <h2>
            Un outil de réservation, pas une vitrine supplémentaire à maintenir.
          </h2>
          <p>
            Upper Glam réunit l’agenda, les règles de disponibilité et le
            traitement des demandes pour garder une activité claire et
            organisée.
          </p>
        </div>
      </Section>
    </>
  )
}
