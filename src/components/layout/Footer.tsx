import { Link } from 'react-router-dom'
import { siteCopy } from '../../content/copy'
import { trackEvent } from '../../lib/analytics'
import { Container } from './Container'

const footerLinks = [
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Mentions legales', to: '/legal' },
  { label: 'Politique de confidentialite', to: '/privacy' },
  { label: 'CGU', to: '/cgu' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--ug-border)] bg-[var(--ug-footer-bg)] py-10">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-lg font-semibold">{siteCopy.brand}</p>
            <p className="text-sm text-[var(--ug-muted)]">
              Plateforme marketing et acquisition pour la beaute premium.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 text-sm text-[var(--ug-muted)] sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.1em] text-[var(--ug-text)] uppercase">
                Liens
              </p>
              {footerLinks.map((item) => (
                <Link
                  className="block hover:text-[var(--ug-accent)]"
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
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.1em] text-[var(--ug-text)] uppercase">
                Reseaux
              </p>
              <a
                className="block hover:text-[var(--ug-accent)]"
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
                className="block hover:text-[var(--ug-accent)]"
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
