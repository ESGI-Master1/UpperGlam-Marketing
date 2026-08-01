import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { AppMockup } from '../components/marketing/AppMockup'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { homeCopy } from '../content/copy'

export function HowItWorksPage() {
  return (
    <>
      <PageMeta
        description="Découvrez comment rechercher un professionnel de la beauté, comparer les profils et réserver un créneau avec Upper Glam."
        title="Comment réserver une prestation beauté"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <Badge>Comment ça marche</Badge>
            <h1 className="text-5xl leading-tight sm:text-6xl">
              Une décision claire avant le premier rendez-vous
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--ug-muted)]">
              Upper Glam rassemble les informations qui sont aujourd’hui
              dispersées : spécialité, réalisations, prix, localisation et
              disponibilités.
            </p>
            <Link
              className={buttonClasses('primary', 'lg')}
              to="/pre-inscription?role=user"
            >
              Créer mon profil
            </Link>
          </div>
          <AppMockup compact />
        </div>
      </Section>

      <Section>
        <ol className="grid gap-10 border-t border-[var(--ug-border)] pt-10 md:grid-cols-3">
          {homeCopy.howItWorks.map((step) => (
            <li className="process-step" key={step.title}>
              <h2 className="text-2xl">{step.title}</h2>
              <p className="mt-4 leading-relaxed text-[var(--ug-muted)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="feature-story">
            <span>Avant</span>
            <h2>
              Des informations réparties entre profils, messages et agendas
            </h2>
            <p>
              Le temps de réponse et le manque de visibilité sur les créneaux
              peuvent interrompre une intention pourtant immédiate.
            </p>
          </article>
          <article className="feature-story feature-story--accent">
            <span>Avec Upper Glam</span>
            <h2>Un parcours continu, du besoin jusqu’à la confirmation</h2>
            <p>
              Chaque étape transmet le contexte à la suivante pour limiter les
              hésitations et les doubles saisies.
            </p>
          </article>
        </div>
      </Section>
    </>
  )
}
