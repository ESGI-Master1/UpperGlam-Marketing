import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { PreSignupPage } from './PreSignup'

vi.mock('../lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    error: null,
    isLoading: false,
    request: vi.fn(),
  }),
}))

function LocationProbe() {
  const location = useLocation()

  return <span data-testid="location">{location.search}</span>
}

describe('PreSignupPage', () => {
  it('preselects client role from query string', () => {
    render(
      <MemoryRouter initialEntries={['/pre-inscription?role=user']}>
        <Routes>
          <Route
            path="/pre-inscription"
            element={
              <>
                <PreSignupPage />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /liste d attente Client/i })
    ).toBeInTheDocument()
  })

  it('preselects provider role from query string and updates query on role switch', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/pre-inscription?role=provider']}>
        <Routes>
          <Route
            path="/pre-inscription"
            element={
              <>
                <PreSignupPage />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /liste d attente Pro/i })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /particulier/i }))

    expect(
      screen.getByRole('heading', { name: /liste d attente Client/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('role=user')
  })
})
