import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type MockResponseOptions = {
  body?: unknown
  ok: boolean
}

function createMockResponse({ body, ok }: MockResponseOptions) {
  return {
    ok,
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  }
}

describe('useApi critical flows', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
    vi.stubEnv('VITE_PUBLIC_BACKEND_URL', 'https://api.upperglam.test/')
  })

  it('builds backend URLs and sends JSON payloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: { data: { id: 1 } },
        ok: true,
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const { useApi } = await import('./useApi')
    const { result } = renderHook(() => useApi())

    let response: unknown
    await act(async () => {
      response = await result.current.request('/pre-registration', {
        body: { email: 'lea@example.com' },
        method: 'POST',
      })
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.upperglam.test/pre-registration',
      {
        body: JSON.stringify({ email: 'lea@example.com' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }
    )
    expect(response).toEqual({ data: { id: 1 } })
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('maps backend error codes to localized messages', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: {
          error: {
            code: 'AUTH_EMAIL_ALREADY_USED',
            message: 'raw backend message',
          },
        },
        ok: false,
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const { useApi } = await import('./useApi')
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await expect(result.current.request('/pre-registration')).rejects.toThrow(
        'Cet email est deja utilise.'
      )
    })

    expect(result.current.error).toBe('Cet email est deja utilise.')
  })

  it('keeps absolute URLs untouched for diagnostics and external calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: null,
        ok: true,
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const { useApi } = await import('./useApi')
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.request('https://status.upperglam.test/health')
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://status.upperglam.test/health',
      {
        body: undefined,
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }
    )
  })
})
