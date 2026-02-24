import { NavLink, useLocation } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { Container } from './Container'

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Comment ca marche', to: '/how-it-works' },
  { label: 'Client & Pro', match: ['/client', '/pro'], to: '/client' },
  {
    label: 'Pre-inscription',
    match: ['/pre-inscription/client', '/pre-inscription/pro'],
    to: '/pre-inscription/client',
  },
  { label: 'A propos', to: '/about' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--ug-border)] bg-[color:var(--ug-header-bg)] backdrop-blur">
      <Container className="py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
          <nav className="flex flex-wrap gap-x-2 gap-y-2 text-[15px] text-[var(--ug-muted)]">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) => {
                  const isGroupedActive = item.match?.includes(
                    location.pathname
                  )
                  const active = isActive || isGroupedActive

                  return active
                    ? 'rounded-full border border-[var(--ug-accent)] bg-[color:rgba(214,179,106,0.2)] px-3 py-1.5 font-semibold text-[var(--ug-text)]'
                    : 'rounded-full px-3 py-1.5 hover:bg-[var(--ug-surface)] hover:text-[var(--ug-text)]'
                }}
                key={item.to}
                onClick={() =>
                  trackEvent('nav_click', {
                    label: item.label,
                    location: 'header',
                    to: item.to,
                  })
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  )
}
