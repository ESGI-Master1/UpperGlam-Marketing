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
    <footer className="border-t border-white/10 bg-[var(--ug-footer-bg)] py-8 text-white sm:py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-3">
            <p className="text-lg font-semibold">{siteCopy.brand}</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Réserver une prestation beauté avec des informations claires sur
              le profil, le prix et les disponibilités.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-sm text-white/55 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div className="col-span-2 lg:col-span-1">
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-white uppercase">
                Liens
              </p>
              <div className="grid grid-cols-2 gap-x-5">
                {footerLinks.map((item) => (
                  <Link
                    className="footer-link"
                    key={item.to}
                    onClick={() =>
                      trackEvent(
                        ['/legal', '/privacy', '/cgu'].includes(item.to)
                          ? 'legal_link_click'
                          : 'nav_click',
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
                  className="footer-link cursor-pointer text-left"
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
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-white uppercase">
                Découvrir
              </p>
              <Link
                className="footer-link"
                onClick={() =>
                  trackEvent('nav_click', {
                    label: 'Réserver une prestation',
                    location: 'footer',
                    to: '/client',
                  })
                }
                to="/client"
              >
                Réserver une prestation
              </Link>
              <Link
                className="footer-link"
                onClick={() =>
                  trackEvent('nav_click', {
                    label: 'Proposer mes services',
                    location: 'footer',
                    to: '/pro',
                  })
                }
                to="/pro"
              >
                Proposer mes services
              </Link>
              <Link
                className="footer-link"
                onClick={() =>
                  trackEvent('nav_click', {
                    label: 'Fonctionnement de la réservation',
                    location: 'footer',
                    to: '/how-it-works',
                  })
                }
                to="/how-it-works"
              >
                Fonctionnement de la réservation
              </Link>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-white uppercase">
                Réseaux
              </p>
              <a
                className="footer-link"
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
                className="footer-link"
                href={`mailto:${siteCopy.email}`}
                onClick={() =>
                  trackEvent('outbound_click', {
                    destination: 'email',
                    location: 'footer',
                    type: 'email',
                  })
                }
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
