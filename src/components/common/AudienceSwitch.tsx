import { NavLink } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { cn } from '../ui/cn'

const items = [
  { label: 'Client(e)', to: '/client' },
  { label: 'Professionnel(le)', to: '/pro' },
]

export function AudienceSwitch() {
  return (
    <div className="inline-flex rounded-full border border-[var(--ug-border)] bg-[var(--ug-surface)] p-1">
      {items.map((item) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[var(--ug-accent)] text-[var(--ug-text-dark)] shadow-sm'
                : 'text-[var(--ug-muted)] hover:text-[var(--ug-text)]'
            )
          }
          key={item.to}
          onClick={() =>
            trackEvent('nav_click', {
              label: item.label,
              location: 'audience_switch',
              to: item.to,
            })
          }
          preventScrollReset
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
