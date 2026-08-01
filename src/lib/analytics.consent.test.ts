import { beforeEach, describe, expect, it, vi } from 'vitest'

const { captureMock } = vi.hoisted(() => ({
  captureMock: vi.fn(),
}))

vi.mock('posthog-js', () => ({
  default: {
    __loaded: true,
    capture: captureMock,
    init: vi.fn(),
  },
}))

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  getAnalyticsContextProperties,
  setAnalyticsConsentStatus,
  trackEvent,
  trackPageView,
  posthogOptions,
} from './analytics'

describe('analytics consent gating', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'phc_test')
    storage = {}
    const localStorageMock: Storage = {
      getItem: (key: string) => (key in storage ? storage[key] : null),
      setItem: (key: string, value: string) => {
        storage[key] = value
      },
      removeItem: (key: string) => {
        delete storage[key]
      },
      clear: () => {
        storage = {}
      },
      key: (index: number) => Object.keys(storage)[index] ?? null,
      get length() {
        return Object.keys(storage).length
      },
    }

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: localStorageMock,
    })

    captureMock.mockReset()
    window.sessionStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('scenario 1: does not send analytics without consent', () => {
    trackEvent('cta_click', { location: 'home' })
    trackPageView({
      pathname: '/home',
      search: '',
      url: 'https://upperglam.fr',
    })

    expect(captureMock).not.toHaveBeenCalled()
    expect(
      window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
    ).toBeNull()
  })

  it('scenario 2: sends analytics after consent is accepted', async () => {
    setAnalyticsConsentStatus('accepted')

    trackEvent('cta_click', { location: 'home' })
    trackPageView({
      pathname: '/pre-inscription',
      search: '?role=client',
      url: 'https://upperglam.fr/pre-inscription?role=client',
    })

    await vi.waitFor(() => expect(captureMock).toHaveBeenCalledTimes(3))
    expect(captureMock).toHaveBeenNthCalledWith(
      1,
      'cta_click',
      expect.objectContaining({ location: 'home' })
    )
    expect(captureMock).toHaveBeenNthCalledWith(
      2,
      '$pageview',
      expect.objectContaining({ pathname: '/pre-inscription' })
    )
    expect(captureMock).toHaveBeenNthCalledWith(
      3,
      'page_view',
      expect.objectContaining({ pathname: '/pre-inscription' })
    )
  })

  it('scenario 3: stops analytics after consent withdrawal', async () => {
    setAnalyticsConsentStatus('accepted')
    trackEvent('cta_click', { location: 'header' })
    await vi.waitFor(() => expect(captureMock).toHaveBeenCalledTimes(1))

    setAnalyticsConsentStatus('refused')
    trackEvent('cta_click', { location: 'footer' })
    trackPageView({
      pathname: '/faq',
      search: '',
      url: 'https://upperglam.fr/faq',
    })

    expect(captureMock).toHaveBeenCalledTimes(1)
  })

  it('drops every event emitted from an admin route', () => {
    const beforeSend = posthogOptions.before_send
    const filter = Array.isArray(beforeSend) ? beforeSend[0] : beforeSend
    const event = {
      event: '$autocapture',
      properties: { $current_url: 'https://upperglam.fr/admin/login' },
      uuid: 'event-id',
    }

    expect(filter?.(event)).toBeNull()
  })

  it('adds non-sensitive attribution context to accepted events', async () => {
    window.history.replaceState(
      {},
      '',
      '/pre-inscription?utm_source=instagram&utm_medium=social&utm_campaign=launch'
    )
    setAnalyticsConsentStatus('accepted')

    trackEvent('pre_signup_role_selected', {
      funnel_name: 'pre_signup',
      role: 'user',
    })

    await vi.waitFor(() =>
      expect(captureMock).toHaveBeenCalledWith(
        'pre_signup_role_selected',
        expect.objectContaining({
          current_path: '/pre-inscription',
          entry_path: '/pre-inscription',
          funnel_name: 'pre_signup',
          traffic_source: 'instagram',
          utm_campaign: 'launch',
          utm_medium: 'social',
          utm_source: 'instagram',
        })
      )
    )
  })

  it('keeps first-touch attribution during the same session', () => {
    window.history.replaceState({}, '', '/?utm_source=tiktok')
    expect(getAnalyticsContextProperties()).toEqual(
      expect.objectContaining({
        entry_path: '/',
        traffic_source: 'tiktok',
        utm_source: 'tiktok',
      })
    )

    window.history.replaceState({}, '', '/pre-inscription')
    expect(getAnalyticsContextProperties()).toEqual(
      expect.objectContaining({
        current_path: '/pre-inscription',
        entry_path: '/',
        traffic_source: 'tiktok',
        utm_source: 'tiktok',
      })
    )
  })
})
