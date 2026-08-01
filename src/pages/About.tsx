import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'

export function AboutPage() {
  return (
    <>
      <PageMeta
        description="Découvrez la vision d’Upper Glam et son approche de la réservation de prestations beauté."
        title="À propos d’Upper Glam"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Badge>À propos</Badge>
            <h1 className="text-5xl leading-tight sm:text-6xl">
              Upper Glam rend les professionnels de beauté plus faciles à
              réserver
            </h1>
          </div>
          <p className="text-xl leading-relaxed text-[var(--ug-muted)]">
            Upper Glam part d’un constat simple : les professionnels de la
            beauté sont visibles en ligne, mais leur disponibilité reste
            difficile à réserver.
          </p>
        </div>
      </Section>

      <Section>
        <figure className="about-visual">
          <img
            alt="Rendez-vous beauté dans un studio contemporain"
            height="1024"
            loading="lazy"
            src="/media/editorial/beauty-workstation.webp"
            width="1536"
          />
          <figcaption>L’univers visuel Upper Glam.</figcaption>
        </figure>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Badge>La démarche</Badge>
          </div>
          <div className="space-y-8 text-lg leading-relaxed text-[var(--ug-muted)]">
            <p>
              Le produit relie trois expériences : une application pour trouver
              et réserver, un espace pour gérer son activité, et des outils
              d’administration pour sécuriser la plateforme.
            </p>
            <p>
              L’écosystème Upper Glam rassemble la recherche, les profils,
              l’agenda, la réservation et le paiement dans un parcours cohérent
              sur Android, iOS et le web. Chaque écran privilégie la lisibilité,
              la confiance et la rapidité d’action.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link className={buttonClasses('primary')} to="/how-it-works">
                Comprendre la réservation Upper Glam
              </Link>
              <Link className={buttonClasses('secondary')} to="/contact">
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
