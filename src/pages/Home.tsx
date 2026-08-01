import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { AppMockup } from '../components/marketing/AppMockup'
import { UsageVoices } from '../components/marketing/UsageVoices'
import { Accordion } from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { faqItems } from '../content/faq'
import { homeCopy } from '../content/copy'
import { services } from '../content/services'
import { trackEvent } from '../lib/analytics'

export function Home() {
  return (
    <>
      <PageMeta
        description="Réservez un professionnel de la beauté selon sa spécialité, son prix et ses disponibilités avec Upper Glam."
        title="Réserver un professionnel de la beauté"
      />

      <Section className="hero-section pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <Badge>{homeCopy.hero.eyebrow}</Badge>
            <h1 className="max-w-3xl text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
              {homeCopy.hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--ug-muted)]">
              {homeCopy.hero.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                className={buttonClasses('primary', 'lg')}
                onClick={() =>
                  trackEvent('cta_click', {
                    cta: 'hero_client',
                    location: 'home_hero',
                    to: '/client',
                  })
                }
                to="/client"
              >
                Trouver une prestation
              </Link>
              <Link
                className={buttonClasses('secondary', 'lg')}
                onClick={() =>
                  trackEvent('cta_click', {
                    cta: 'hero_pro',
                    location: 'home_hero',
                    to: '/pro',
                  })
                }
                to="/pro"
              >
                Développer mon activité
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-[var(--ug-muted)]">
              {homeCopy.hero.description3}
            </p>
          </div>

          <figure className="editorial-figure">
            <img
              alt="Professionnelle de la beauté préparant une cliente dans un studio élégant"
              fetchPriority="high"
              height="1024"
              src="/media/editorial/beauty-appointment.webp"
              width="1536"
            />
            <figcaption>
              Une expérience pensée pour la confiance, avant même le
              rendez-vous.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section className="py-5 sm:py-7">
        <div className="proof-line" aria-label="État du produit">
          <span>
            <strong>3</strong> espaces reliés
          </span>
          <span>
            <strong>1</strong> parcours de réservation
          </span>
          <span>
            <strong>3 plateformes</strong> Android, iOS et web
          </span>
        </div>
      </Section>

      <Section id="how-it-works">
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <Badge>Comment ça marche</Badge>
            <h2 className="text-4xl sm:text-5xl">
              De l’envie au rendez-vous, sans rupture
            </h2>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {homeCopy.howItWorks.map((step) => (
              <li className="process-step" key={step.title}>
                <h3 className="text-2xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--ug-muted)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="overflow-hidden bg-[var(--ug-ink)] text-white">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <AppMockup />
          <div className="space-y-6">
            <Badge>Le parcours en conditions réelles</Badge>
            <h2 className="text-4xl leading-tight sm:text-5xl">
              Du premier coup d’œil au créneau confirmé
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-white/65">
              Les clientes comparent les profils, découvrent les réalisations et
              choisissent une disponibilité sans quitter le même parcours, sur
              Android, iOS et le web.
            </p>
            <div className="app-flow-preview">
              <img
                alt="Démonstration animée du parcours de réservation Upper Glam"
                height="1067"
                loading="lazy"
                src="/media/app/customer-flow.gif"
                width="480"
              />
              <span>12 secondes pour trouver et réserver</span>
            </div>
            <Link className={buttonClasses('primary', 'lg')} to="/how-it-works">
              Découvrir le parcours
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <Badge>Prestations beauté</Badge>
            <h2 className="text-4xl sm:text-5xl">
              Une recherche adaptée au besoin
            </h2>
          </div>
          <div className="service-list">
            {services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-px overflow-hidden rounded-[var(--ug-radius-lg)] border border-[var(--ug-border)] bg-[var(--ug-border)] lg:grid-cols-2">
          <article className="audience-panel">
            <Badge>Pour les clientes</Badge>
            <h2 className="text-3xl">
              Réserver avec toutes les informations utiles
            </h2>
            <p>{homeCopy.clientBlock}</p>
            <Link className={buttonClasses('secondary')} to="/client">
              Découvrir le parcours client
            </Link>
          </article>
          <article className="audience-panel audience-panel--dark">
            <Badge>Pour les professionnels</Badge>
            <h2 className="text-3xl">
              Transformer la visibilité en rendez-vous
            </h2>
            <p>{homeCopy.proBlock}</p>
            <Link className={buttonClasses('primary')} to="/pro">
              Découvrir l’espace professionnel
            </Link>
          </article>
        </div>
      </Section>

      <Section>
        <div className="space-y-9">
          <div className="max-w-2xl space-y-3">
            <Badge>Au quotidien</Badge>
            <h2 className="text-4xl sm:text-5xl">
              Une expérience pensée pour aller à l’essentiel
            </h2>
          </div>
          <UsageVoices />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-3">
            <Badge>FAQ</Badge>
            <h2 className="text-4xl sm:text-5xl">Questions fréquentes</h2>
          </div>
          <Accordion
            items={faqItems.slice(0, 4).map((item, index) => ({
              ...item,
              id: `home-faq-${index}`,
            }))}
          />
        </div>
      </Section>

      <Section className="pb-24">
        <div className="final-cta">
          <Badge>Rejoindre Upper Glam</Badge>
          <h2>Votre prochain rendez-vous commence ici.</h2>
          <p>
            Créez votre profil pour réserver une prestation ou présenter votre
            activité.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className={buttonClasses('primary', 'lg')}
              to="/pre-inscription?role=user"
            >
              Créer mon profil client
            </Link>
            <Link
              className={buttonClasses('secondary', 'lg')}
              to="/pre-inscription?role=provider"
            >
              Je suis professionnel
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
