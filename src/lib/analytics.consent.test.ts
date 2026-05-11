import { beforeEach, describe, expect, it, vi } from 'vitest'

const { captureMock } = vi.hoisted(() => ({
  captureMock: vi.fn(),
}))

vi.mock('posthog-js', () => ({
  default: {
    capture: captureMock,
  },
}))

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  setAnalyticsConsentStatus,
  trackEvent,
  trackPageView,
} from './analytics'

describe('analytics consent gating', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
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

  it('scenario 2: sends analytics after consent is accepted', () => {
    setAnalyticsConsentStatus('accepted')

    trackEvent('cta_click', { location: 'home' })
    trackPageView({
      pathname: '/pre-inscription',
      search: '?role=client',
      url: 'https://upperglam.fr/pre-inscription?role=client',
    })

    expect(captureMock).toHaveBeenCalledTimes(3)
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

  it('scenario 3: stops analytics after consent withdrawal', () => {
    setAnalyticsConsentStatus('accepted')
    trackEvent('cta_click', { location: 'header' })
    expect(captureMock).toHaveBeenCalledTimes(1)

    setAnalyticsConsentStatus('refused')
    trackEvent('cta_click', { location: 'footer' })
    trackPageView({
      pathname: '/faq',
      search: '',
      url: 'https://upperglam.fr/faq',
    })

    expect(captureMock).toHaveBeenCalledTimes(1)
  })
})
