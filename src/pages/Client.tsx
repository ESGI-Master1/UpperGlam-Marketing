import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { trackEvent } from '../lib/analytics'

const benefits = [
  'Voir en temps reel les professionnel(le)s disponibles autour de chez toi.',
  'Choisir parmi une large gamme de prestations selon tes besoins.',
  'Profiter d horaires flexibles qui s ajustent a ton emploi du temps.',
]

const useCases = [
  'Rendez-vous en salon ou prestation a domicile.',
  'Mise en beaute express, routine, evenementiel.',
  'Fini les recherches interminables: des expert(e)s en quelques clics.',
]

export function ClientPage() {
  return (
    <>
      <PageMeta
        description="Trouvez rapidement le bon professionnel beaute et reservez avec confiance sur Upper Glam."
        title="Client(e)"
      />
      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl">
              Les meilleur(e)s professionnel(le)s de la beaute en trois clics
              autour de toi.
            </h1>
            <p className="max-w-2xl leading-relaxed text-[var(--ug-muted)]">
              Ne perds plus de temps. Upper Glam te connecte en temps reel a des
              professionnel(le)s d exception, selon tes envies.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit}>
                <p className="text-sm">{benefit}</p>
              </Card>
            ))}
          </div>
          <Card className="space-y-6">
            <h2 className="text-2xl">Cas d usage</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-[var(--ug-muted)]">
              {useCases.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <Link
              className={buttonClasses('primary')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'client_signup',
                  location: 'client_page',
                  to: '/pre-inscription/client',
                })
              }
              to="/pre-inscription/client"
            >
              Je me pre-inscris
            </Link>
          </Card>
        </div>
      </Section>
    </>
  )
}
