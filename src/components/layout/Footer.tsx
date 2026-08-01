import { Link } from 'react-router-dom'
import { siteCopy } from '../../content/copy'
import { openCookiePreferences, trackEvent } from '../../lib/analytics'
import { Container } from './Container'

const footerLinks = [
  { label: 'Prestations beauté', to: '/prestations' },
  { label: 'Professionnels', to: '/professionnels' },
  { label: 'Villes disponibles', to: '/villes' },
  { label: 'Confiance et sécurité', to: '/confiance' },
  { label: 'À propos', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Mentions légales', to: '/legal' },
  { label: 'Politique de confidentialité', to: '/privacy' },
  { label: 'CGU', to: '/cgu' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--ug-footer-bg)] py-12 text-white">
      <Container>
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <p className="text-lg font-semibold">{siteCopy.brand}</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Réserver une prestation beauté avec des informations claires sur
              le profil, le prix et les disponibilités.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 text-sm text-white/55 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.1em] text-white uppercase">
                Liens
              </p>
              {footerLinks.map((item) => (
                <Link
                  className="flex min-h-11 items-center hover:text-[var(--ug-accent)]"
                  key={item.to}
                  onClick={() =>
                    trackEvent(
                      item.to === '/contact' ? 'nav_click' : 'legal_link_click',
                      {
                        label: item.label,
                        location: 'footer',
                        to: item.to,
                      }
                    )
                  }
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
              <button
                className="flex min-h-11 cursor-pointer items-center text-left hover:text-[var(--ug-accent)]"
                onClick={() => {
                  openCookiePreferences()
                  trackEvent('legal_link_click', {
                    label: 'Gérer mes cookies',
                    location: 'footer',
                    to: 'cookie_preferences',
                  })
                }}
                type="button"
              >
                Gérer mes cookies
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.1em] text-white uppercase">
                Découvrir
              </p>
              <Link
                className="flex min-h-11 items-center hover:text-[var(--ug-accent)]"
                to="/client"
              >
                Réserver une prestation
              </Link>
              <Link
                className="flex min-h-11 items-center hover:text-[var(--ug-accent)]"
                to="/pro"
              >
                Proposer mes services
              </Link>
              <Link
                className="flex min-h-11 items-center hover:text-[var(--ug-accent)]"
                to="/how-it-works"
              >
                Fonctionnement de la réservation
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.1em] text-white uppercase">
                Réseaux
              </p>
              <a
                className="flex min-h-11 items-center hover:text-[var(--ug-accent)]"
                href={siteCopy.instagramUrl}
                onClick={() =>
                  trackEvent('outbound_click', {
                    destination: siteCopy.instagramUrl,
                    location: 'footer',
                    type: 'instagram',
                  })
                }
                rel="noreferrer"
                target="_blank"
              >
                Instagram {siteCopy.instagramHandle}
              </a>
              <a
                className="flex min-h-11 items-center hover:text-[var(--ug-accent)]"
                href={`mailto:${siteCopy.email}`}
              >
                {siteCopy.email}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
