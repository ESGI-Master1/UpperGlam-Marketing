import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminRequireAuth } from './AdminRequireAuth'

const { getAdminTokenMock } = vi.hoisted(() => ({
  getAdminTokenMock: vi.fn(),
}))

vi.mock('../../lib/adminSession', () => ({
  getAdminToken: getAdminTokenMock,
}))

function LocationEcho() {
  const location = useLocation()
  return <div>{`${location.pathname}${location.search}`}</div>
}

describe('AdminRequireAuth', () => {
  beforeEach(() => {
    getAdminTokenMock.mockReset()
  })

  it('redirects to login with next query when token is missing', () => {
    getAdminTokenMock.mockReturnValue(null)

    render(
      <MemoryRouter initialEntries={['/admin/pre-inscriptions?page=2']}>
        <Routes>
          <Route path="/admin">
            <Route element={<AdminRequireAuth />}>
              <Route path="pre-inscriptions" element={<div>protected</div>} />
            </Route>
            <Route path="login" element={<LocationEcho />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText(
        '/admin/login?next=%2Fadmin%2Fpre-inscriptions%3Fpage%3D2'
      )
    ).toBeInTheDocument()
  })

  it('renders protected route when token exists', () => {
    getAdminTokenMock.mockReturnValue('token-123')

    render(
      <MemoryRouter initialEntries={['/admin/pre-inscriptions']}>
        <Routes>
          <Route path="/admin">
            <Route element={<AdminRequireAuth />}>
              <Route path="pre-inscriptions" element={<div>protected</div>} />
            </Route>
            <Route path="login" element={<div>login</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('protected')).toBeInTheDocument()
  })
})
