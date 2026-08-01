import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  clearAdminSession,
  getAdminEmail,
  getAdminToken,
} from '../lib/adminSession'
import { posthogOptions } from '../lib/analytics'

const navigation = [
  { label: 'Vue d’ensemble', short: 'Pilotage', to: '/admin/tableau-de-bord' },
  {
    label: 'Pré-inscriptions',
    short: 'Demandes',
    to: '/admin/pre-inscriptions',
  },
  { label: 'Utilisatrices', short: 'Clientes', to: '/admin/utilisateurs' },
  { label: 'Prestataires', short: 'Réseau pro', to: '/admin/prestataires' },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = getAdminToken()
  const adminEmail = getAdminEmail()
  const onLoginPage = location.pathname === '/admin/login'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    )
    const previousRobots = robots?.content
    robots?.setAttribute('content', 'noindex, nofollow')
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.set_config({
        autocapture: false,
        capture_pageleave: false,
        capture_pageview: false,
      })
    })
    return () => {
      if (robots && previousRobots) robots.content = previousRobots
      void import('posthog-js').then(({ default: posthog }) => {
        posthog.set_config({
          autocapture: posthogOptions.autocapture ?? true,
          capture_pageleave: posthogOptions.capture_pageleave ?? true,
          capture_pageview: posthogOptions.capture_pageview ?? false,
        })
      })
    }
  }, [])

  const logout = () => {
    clearAdminSession()
    navigate('/admin/login', { replace: true })
  }
  if (onLoginPage || !token)
    return (
      <div className="min-h-screen bg-[#f8f4ef]">
        <Outlet />
      </div>
    )

  return (
    <div className="min-h-screen bg-[#f6f2ed] text-[#201a17] lg:grid lg:grid-cols-[260px_1fr]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/8 bg-[#241d19] px-4 py-3 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <img
            alt="Upper Glam"
            className="h-9 w-9 rounded-full object-cover"
            src="/logo.png"
          />
          <span className="font-serif text-xl">Upper Glam</span>
        </div>
        <button
          aria-expanded={menuOpen}
          className="rounded-full border border-white/20 px-4 py-2 text-sm"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
      </header>
      <aside
        className={`${menuOpen ? 'flex' : 'hidden'} fixed inset-x-0 top-[65px] z-20 h-[calc(100vh-65px)] flex-col bg-[#241d19] p-5 text-[#f8f2eb] lg:sticky lg:top-0 lg:flex lg:h-screen`}
      >
        <div className="hidden items-center gap-3 border-b border-white/10 pb-6 lg:flex">
          <img
            alt="Upper Glam"
            className="h-11 w-11 rounded-full object-cover"
            src="/logo.png"
          />
          <div>
            <p className="font-serif text-xl">Upper Glam</p>
            <p className="text-[10px] tracking-[0.18em] text-[#bdafa4] uppercase">
              Administration
            </p>
          </div>
        </div>
        <nav
          className="mt-2 space-y-1 lg:mt-8"
          aria-label="Navigation administration"
        >
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-[#d7b476] font-bold text-[#241d19]' : 'text-[#d8cec7] hover:bg-white/8 hover:text-white'}`
              }
              key={item.to}
              onClick={() => setMenuOpen(false)}
              to={item.to}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-60">{item.short}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-xs text-[#bdafa4]">Connecté avec</p>
          <p className="mt-1 truncate text-sm font-semibold">{adminEmail}</p>
          <button
            className="mt-4 text-sm text-[#e5c995] hover:underline"
            onClick={logout}
          >
            Se déconnecter
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
        <div className="mx-auto max-w-[1500px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
