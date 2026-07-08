import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAdminSession,
  getAdminEmail,
  getAdminSessionExpiresAt,
  getAdminToken,
  setAdminSession,
} from './adminSession'

describe('adminSession', () => {
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
  })

  it('stores and reads admin token/email', () => {
    const expiresAt = new Date(Date.now() + 60_000).toISOString()
    setAdminSession('token-123', 'admin@upperglam.fr', expiresAt)

    expect(getAdminToken()).toBe('token-123')
    expect(getAdminEmail()).toBe('admin@upperglam.fr')
    expect(getAdminSessionExpiresAt()).toBe(expiresAt)
  })

  it('clears admin session', () => {
    setAdminSession(
      'token-123',
      'admin@upperglam.fr',
      new Date(Date.now() + 60_000).toISOString()
    )
    clearAdminSession()

    expect(getAdminToken()).toBeNull()
    expect(getAdminEmail()).toBeNull()
    expect(getAdminSessionExpiresAt()).toBeNull()
  })

  it('clears expired admin session when it is read', () => {
    setAdminSession(
      'token-123',
      'admin@upperglam.fr',
      new Date(Date.now() - 60_000).toISOString()
    )

    expect(getAdminToken()).toBeNull()
    expect(getAdminEmail()).toBeNull()
    expect(getAdminSessionExpiresAt()).toBeNull()
  })
})
