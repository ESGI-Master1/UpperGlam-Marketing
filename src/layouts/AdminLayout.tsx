import { useEffect } from 'react'
import posthog from 'posthog-js'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import {
  clearAdminSession,
  getAdminEmail,
  getAdminSessionExpiresAt,
  getAdminToken,
} from '../lib/adminSession'
import { posthogOptions } from '../lib/analytics'

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = getAdminToken()
  const adminEmail = getAdminEmail()
  const expiresAt = getAdminSessionExpiresAt()
  const onLoginPage = location.pathname === '/admin/login'

  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    )
    const previousRobots = robots?.content
    robots?.setAttribute('content', 'noindex, nofollow')

    posthog.set_config({
      autocapture: false,
      capture_pageleave: false,
      capture_pageview: false,
    })

    return () => {
      if (robots && previousRobots) {
        robots.content = previousRobots
      }
      posthog.set_config({
        autocapture: posthogOptions.autocapture ?? true,
        capture_pageleave: posthogOptions.capture_pageleave ?? true,
        capture_pageview: posthogOptions.capture_pageview ?? false,
      })
    }
  }, [])

  const logout = () => {
    clearAdminSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--ug-bg)] text-[var(--ug-text)]">
      <header className="border-b border-[var(--ug-border)] bg-[var(--ug-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm tracking-[0.16em] text-[var(--ug-muted)] uppercase">
              Upper Glam
            </p>
            <h1 className="text-xl font-semibold">Back office admin</h1>
          </div>

          {token && !onLoginPage && (
            <div className="flex flex-wrap items-center gap-2">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full border border-[var(--ug-accent)] bg-[color:rgba(214,179,106,0.2)] px-3 py-1.5 text-sm font-semibold'
                    : 'rounded-full px-3 py-1.5 text-sm text-[var(--ug-muted)] hover:bg-[var(--ug-card-bg)]'
                }
                to="/admin/pre-inscriptions"
              >
                Pre-inscriptions
              </NavLink>
              {adminEmail && (
                <span className="rounded-full border border-[var(--ug-border)] px-3 py-1.5 text-sm text-[var(--ug-muted)]">
                  {adminEmail}
                  {expiresAt && (
                    <span className="ml-2 text-xs">
                      expire {new Date(expiresAt).toLocaleString('fr-FR')}
                    </span>
                  )}
                </span>
              )}
              <Button onClick={logout} size="md" variant="secondary">
                Se deconnecter
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
