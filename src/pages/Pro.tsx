import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import { trackEvent } from '../lib/analytics'

const proBenefits = [
  'Fini les imprevus: Upper Glam aide a remplir les creneaux libres rapidement.',
  'Trouve des client(e)s qualifie(e)s qui recherchent ton expertise.',
  'Valorise ton talent avec photos, avis verifies et profil transparent.',
]

const itIsNot = [
  'Ce n est pas une simple vitrine: c est un levier pour optimiser ton planning.',
  'Ce n est pas reserve a un seul metier: toute la beaute est concernee.',
  'Ce n est pas une promesse floue: c est un outil concret pour gagner en visibilite.',
]

export function ProPage() {
  return (
    <>
      <PageMeta
        description="Upper Glam aide les professionnels beaute a gagner en visibilite et en conversions de qualite."
        title="Professionnel(le)"
      />
      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl">
              Avec Upper Glam, simplifie ton quotidien et developpe ton
              activite.
            </h1>
            <p className="max-w-2xl leading-relaxed text-[var(--ug-muted)]">
              Rejoins Upper Glam et laisse-nous t accompagner pour optimiser ton
              planning tout en augmentant ta visibilite.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {proBenefits.map((benefit) => (
              <Card key={benefit}>
                <p className="text-sm">{benefit}</p>
              </Card>
            ))}
          </div>
          <Card className="space-y-6">
            <h2 className="text-2xl">Ce que ce n est pas</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-[var(--ug-muted)]">
              {itIsNot.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <Link
              className={buttonClasses('primary')}
              onClick={() =>
                trackEvent('cta_click', {
                  cta: 'pro_signup',
                  location: 'pro_page',
                  to: '/pre-inscription/pro',
                })
              }
              to="/pre-inscription/pro"
            >
              Je me pre-inscris en tant que pro
            </Link>
          </Card>
        </div>
      </Section>
    </>
  )
}
