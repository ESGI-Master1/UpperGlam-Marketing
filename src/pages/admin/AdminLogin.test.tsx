import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminLoginPage } from './AdminLogin'

const {
  loginAdminMock,
  assertAdminAccessMock,
  clearAdminSessionMock,
  setAdminSessionMock,
  getAdminTokenMock,
} = vi.hoisted(() => ({
  loginAdminMock: vi.fn(),
  assertAdminAccessMock: vi.fn(),
  clearAdminSessionMock: vi.fn(),
  setAdminSessionMock: vi.fn(),
  getAdminTokenMock: vi.fn(),
}))

vi.mock('../../lib/adminSession', () => ({
  clearAdminSession: clearAdminSessionMock,
  getAdminToken: getAdminTokenMock,
  setAdminSession: setAdminSessionMock,
}))

vi.mock('../../lib/adminApi', () => {
  class ApiRequestError extends Error {
    code?: string
    status: number

    constructor({
      code,
      message,
      status,
    }: {
      code?: string
      message: string
      status: number
    }) {
      super(message)
      this.code = code
      this.status = status
    }
  }

  return {
    ApiRequestError,
    assertAdminAccess: assertAdminAccessMock,
    loginAdmin: loginAdminMock,
  }
})

describe('AdminLoginPage critical flow', () => {
  beforeEach(() => {
    loginAdminMock.mockReset()
    assertAdminAccessMock.mockReset()
    clearAdminSessionMock.mockReset()
    setAdminSessionMock.mockReset()
    getAdminTokenMock.mockReset()
    getAdminTokenMock.mockReturnValue(null)
  })

  it('authenticates admin and redirects to /admin next path', async () => {
    loginAdminMock.mockResolvedValue({
      token: 'admin-jwt',
      user: { email: 'admin@upperglam.fr', id: 1 },
    })
    assertAdminAccessMock.mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <MemoryRouter
        initialEntries={['/admin/login?next=/admin/pre-inscriptions']}
      >
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/pre-inscriptions"
            element={<div>admin home</div>}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Email/i), 'admin@upperglam.fr')
    await user.type(screen.getByLabelText(/Mot de passe/i), 'StrongPass123!')
    await user.click(screen.getByRole('button', { name: /Se connecter/i }))

    await waitFor(() => {
      expect(screen.getByText('admin home')).toBeInTheDocument()
    })

    expect(loginAdminMock).toHaveBeenCalledWith(
      'admin@upperglam.fr',
      'StrongPass123!'
    )
    expect(setAdminSessionMock).toHaveBeenCalledWith(
      'admin-jwt',
      'admin@upperglam.fr'
    )
    expect(assertAdminAccessMock).toHaveBeenCalledWith('admin-jwt')
  })

  it('shows dedicated message when account is not admin', async () => {
    const { ApiRequestError } = await import('../../lib/adminApi')
    loginAdminMock.mockResolvedValue({
      token: 'admin-jwt',
      user: { email: 'admin@upperglam.fr', id: 1 },
    })
    assertAdminAccessMock.mockRejectedValue(
      new ApiRequestError({
        code: 'ADMIN_FORBIDDEN',
        message: 'forbidden',
        status: 403,
      })
    )
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Email/i), 'admin@upperglam.fr')
    await user.type(screen.getByLabelText(/Mot de passe/i), 'StrongPass123!')
    await user.click(screen.getByRole('button', { name: /Se connecter/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Ce compte n a pas les droits administrateur/i)
      ).toBeInTheDocument()
    })

    expect(clearAdminSessionMock).toHaveBeenCalledTimes(1)
  })
})
