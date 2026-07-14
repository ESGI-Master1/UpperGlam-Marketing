import { beforeEach, describe, expect, it, vi } from 'vitest'

type MockResponseOptions = {
  body?: unknown
  ok: boolean
  status?: number
}

function createMockResponse({ body, ok, status = 200 }: MockResponseOptions) {
  return {
    ok,
    status,
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  }
}

describe('adminApi critical flows', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
    vi.stubEnv('VITE_PUBLIC_BACKEND_URL', 'https://api.upperglam.test/')
  })

  it('loginAdmin sends expected payload and returns data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: {
          data: {
            expiresAt: '2099-01-01T00:00:00.000Z',
            token: 'jwt-token',
            user: { email: 'admin@upperglam.fr', id: 42 },
          },
        },
        ok: true,
      })
    )

    vi.stubGlobal('fetch', fetchMock)
    const { loginAdmin } = await import('./adminApi')

    const result = await loginAdmin('admin@upperglam.fr', 'StrongPass123!')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.upperglam.test/auth/login',
      {
        body: JSON.stringify({
          deviceName: 'upperglam-admin-web',
          email: 'admin@upperglam.fr',
          password: 'StrongPass123!',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }
    )
    expect(result).toEqual({
      expiresAt: '2099-01-01T00:00:00.000Z',
      token: 'jwt-token',
      user: { email: 'admin@upperglam.fr', id: 42 },
    })
  })

  it('fetchAdminPreRegistrations builds query parameters and auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: {
          data: [{ id: 1 }],
          meta: { limit: 20, page: 2, total: 1 },
        },
        ok: true,
      })
    )

    vi.stubGlobal('fetch', fetchMock)
    const { fetchAdminPreRegistrations } = await import('./adminApi')

    await fetchAdminPreRegistrations('token-abc', {
      accountStatus: 'pending',
      limit: 20,
      page: 2,
      reviewStatus: 'submitted',
      role: 'provider',
      search: 'paris',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.upperglam.test/admin/pre-registrations?limit=20&page=2&role=provider&reviewStatus=submitted&accountStatus=pending&search=paris',
      {
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-abc',
        },
        method: 'GET',
      }
    )
  })

  it('fetchAdminAuditEvents builds query parameters and auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: {
          data: [{ action: 'admin.pre_registration.approved', id: 1 }],
          meta: { limit: 10, page: 1, total: 1 },
        },
        ok: true,
      })
    )

    vi.stubGlobal('fetch', fetchMock)
    const { fetchAdminAuditEvents } = await import('./adminApi')

    await fetchAdminAuditEvents('token-abc', {
      limit: 10,
      page: 1,
      preRegistrationId: 5,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.upperglam.test/admin/audit-events?limit=10&page=1&preRegistrationId=5',
      {
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-abc',
        },
        method: 'GET',
      }
    )
  })

  it('throws mapped ApiRequestError on backend validation error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        body: {
          error: {
            code: 'VALIDATION_ERROR',
          },
        },
        ok: false,
        status: 400,
      })
    )

    vi.stubGlobal('fetch', fetchMock)
    const { ApiRequestError, fetchAdminPreRegistrations } =
      await import('./adminApi')

    await expect(
      fetchAdminPreRegistrations('token-abc', { limit: 10, page: 1 })
    ).rejects.toBeInstanceOf(ApiRequestError)

    await expect(
      fetchAdminPreRegistrations('token-abc', { limit: 10, page: 1 })
    ).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Certaines donnees sont invalides.',
      status: 400,
    })
  })
})
