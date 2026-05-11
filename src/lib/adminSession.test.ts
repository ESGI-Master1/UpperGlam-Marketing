import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAdminSession,
  getAdminEmail,
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
    setAdminSession('token-123', 'admin@upperglam.fr')

    expect(getAdminToken()).toBe('token-123')
    expect(getAdminEmail()).toBe('admin@upperglam.fr')
  })

  it('clears admin session', () => {
    setAdminSession('token-123', 'admin@upperglam.fr')
    clearAdminSession()

    expect(getAdminToken()).toBeNull()
    expect(getAdminEmail()).toBeNull()
  })
})
