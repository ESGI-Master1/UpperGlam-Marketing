import { NavLink, useLocation } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { Container } from './Container'

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Comment ça marche', to: '/how-it-works' },
  {
    label: 'Prestations',
    match: ['/prestations', '/villes', '/professionnels'],
    to: '/prestations',
  },
  { label: 'Client & Pro', match: ['/client', '/pro'], to: '/client' },
  {
    label: 'Créer mon profil',
    match: [
      '/pre-inscription',
      '/pre-inscription/client',
      '/pre-inscription/pro',
    ],
    to: '/pre-inscription',
  },
]

function Navigation({ mobile = false }: { mobile?: boolean }) {
  const location = useLocation()

  return (
    <nav
      aria-label={mobile ? 'Navigation mobile' : 'Navigation principale'}
      className={
        mobile
          ? 'grid gap-1 pt-3 text-[15px] text-[var(--ug-muted)]'
          : 'hidden flex-wrap gap-1 text-[15px] text-[var(--ug-muted)] lg:flex'
      }
    >
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) => {
            const active = isActive || item.match?.includes(location.pathname)
            const base = 'inline-flex min-h-11 items-center rounded-full px-4'

            return active
              ? `${base} border border-[var(--ug-accent)] bg-[color:rgba(214,179,106,0.2)] font-semibold text-[var(--ug-text)]`
              : `${base} hover:bg-[var(--ug-surface)] hover:text-[var(--ug-text)]`
          }}
          key={item.to}
          onClick={() => {
            trackEvent('nav_click', {
              label: item.label,
              location: mobile ? 'mobile_header' : 'header',
              to: item.to,
            })
            if (item.to === '/pre-inscription') {
              trackEvent('cta_click', {
                cta: 'header_pre_signup',
                funnel_name: 'pre_signup',
                funnel_step: 'cta_click',
                location: mobile ? 'mobile_header' : 'header',
                to: item.to,
              })
            }
          }}
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--ug-border)] bg-[color:var(--ug-header-bg)] backdrop-blur-xl">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            className="inline-flex items-center gap-2"
            onClick={() =>
              trackEvent('nav_click', { location: 'header', to: '/' })
            }
            to="/"
          >
            <img
              alt="Upper Glam"
              className="h-16 w-16 object-contain"
              src="/logo.png"
            />
          </NavLink>
          <Navigation />
          <details className="group relative lg:hidden">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full border border-[var(--ug-border)] px-4 font-medium">
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Fermer</span>
            </summary>
            <div className="absolute top-full right-0 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-[var(--ug-border)] bg-[var(--ug-bg)] p-3 shadow-xl">
              <Navigation mobile />
            </div>
          </details>
        </div>
      </Container>
    </header>
  )
}
