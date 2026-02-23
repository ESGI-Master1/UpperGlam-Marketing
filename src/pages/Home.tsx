import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Accordion } from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
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
        description="Upper Glam relie clientes et professionnels beaute avec une experience premium, rapide et fiable."
        title="Accueil"
      />

      <Section className="pt-10 sm:pt-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-7">
            <Badge>{homeCopy.hero.eyebrow}</Badge>
            <h1 className="text-4xl mb-4 leading-tight font-semibold sm:text-5xl">
              {homeCopy.hero.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--ug-muted)] sm:text-lg">
              {homeCopy.hero.description}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--ug-muted)] sm:text-base">
              {homeCopy.hero.description2}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--ug-muted)] sm:text-base">
              {homeCopy.hero.description3}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className={buttonClasses(
                  'primary',
                  'lg',
                  'text-base sm:text-lg'
                )}
                onClick={() =>
                  trackEvent('cta_click', {
                    cta: 'hero_client',
                    location: 'home_hero',
                    to: '/client',
                  })
                }
                to="/client"
              >
                Je suis client(e)
              </Link>
              <Link
                className={buttonClasses(
                  'secondary',
                  'lg',
                  'text-base sm:text-lg'
                )}
                onClick={() =>
                  trackEvent('cta_click', {
                    cta: 'hero_pro',
                    location: 'home_hero',
                    to: '/pro',
                  })
                }
                to="/pro"
              >
                Je suis professionnel(le)
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Card className="h-full">
              <div className="relative aspect-square h-full overflow-hidden rounded-xl border border-[var(--ug-border)] bg-[var(--ug-surface)]">
                <video
                  autoPlay
                  className="h-full w-full object-cover object-center"
                  loop
                  muted
                  playsInline
                  src="/hero-banner.webm"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 p-2 backdrop-blur">
                  <img
                    alt="Upper Glam"
                    className="h-full w-full object-contain"
                    src="/logo.png"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="how-it-works">
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>Comment ca marche</Badge>
            <h2 className="text-3xl sm:text-4xl">
              Un parcours clair en 3 etapes
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {homeCopy.howItWorks.map((step) => (
              <Card key={step.title}>
                <h3 className="text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ug-muted)]">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>Prestations</Badge>
            <h2 className="text-3xl sm:text-4xl">
              Tout le parcours beaute, au meme endroit
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {services.map((service) => (
              <Card className="p-4" key={service}>
                <p className="text-sm">{service}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="space-y-6">
            <Badge>Client(e)</Badge>
            <h3 className="text-2xl">Reservez avec confiance</h3>
            <p className="text-sm leading-relaxed text-[var(--ug-muted)]">
              {homeCopy.clientBlock}
            </p>
            <Link
              className={buttonClasses('primary')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'home_client_card',
                  location: 'home_blocks',
                  to: '/client',
                })
              }
              to="/client"
            >
              Voir l'espace client
            </Link>
          </Card>
          <Card className="space-y-6">
            <Badge>Professionnel(le)</Badge>
            <h3 className="text-2xl">Developpez votre activite</h3>
            <p className="text-sm leading-relaxed text-[var(--ug-muted)]">
              {homeCopy.proBlock}
            </p>
            <Link
              className={buttonClasses('secondary')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'home_pro_card',
                  location: 'home_blocks',
                  to: '/pro',
                })
              }
              to="/pro"
            >
              Voir l'espace pro
            </Link>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>Temoignages</Badge>
            <h2 className="text-3xl sm:text-4xl">
              Ce que disent nos utilisateurs
            </h2>
          </div>
          <Card>
            <p className="text-sm text-[var(--ug-muted)]">
              [PLACEHOLDER_TESTIMONIALS]
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl">Questions frequentes</h2>
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
        <Card className="space-y-6 text-center">
          <h2 className="text-3xl sm:text-4xl">Prete a passer a l'action ?</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[var(--ug-muted)]">
            Rejoignez Upper Glam pour reserver plus vite, mieux convertir et
            mieux fideliser.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className={buttonClasses('primary')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'home_final_client',
                  location: 'home_final_cta',
                  to: '/client',
                })
              }
              to="/client"
            >
              Commencer cote client(e)
            </Link>
            <Link
              className={buttonClasses('secondary')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'home_final_pro',
                  location: 'home_final_cta',
                  to: '/pro',
                })
              }
              to="/pro"
            >
              Commencer cote pro
            </Link>
          </div>
        </Card>
      </Section>
    </>
  )
}
