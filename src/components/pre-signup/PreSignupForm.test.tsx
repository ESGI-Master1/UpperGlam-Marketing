import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PreSignupForm } from './PreSignupForm'

const { requestMock, trackEventMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
  trackEventMock: vi.fn(),
}))

vi.mock('../../hooks/useApi', () => ({
  useApi: () => ({
    error: null,
    isLoading: false,
    request: requestMock,
  }),
}))

vi.mock('../../lib/analytics', () => ({
  trackEvent: trackEventMock,
}))

describe('PreSignupForm critical flow', () => {
  beforeEach(() => {
    requestMock.mockReset()
    trackEventMock.mockReset()
  })

  it('submits user pre-registration payload and tracks event', async () => {
    requestMock.mockResolvedValue({ data: { id: 1 } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <PreSignupForm
          ctaLabel="Je me pre-inscris"
          intro="intro"
          role="user"
          title="title"
          trackingFormName="pre_signup_client"
        />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Prenom/i), 'Lea')
    await user.type(screen.getByLabelText(/^Nom$/i), 'Martin')
    await user.type(screen.getByLabelText(/Email/i), 'lea@example.com')
    await user.type(screen.getByLabelText(/Mot de passe/i), 'StrongPass123!')
    await user.type(screen.getByLabelText(/Telephone/i), '0600000000')
    await user.type(screen.getByLabelText(/Ville/i), 'Paris')
    await user.type(screen.getByLabelText(/Code postal/i), '75011')
    await user.click(screen.getByRole('checkbox', { name: /J accepte/i }))
    await user.click(screen.getByRole('button', { name: /Je me pre-inscris/i }))

    await waitFor(() => {
      expect(requestMock).toHaveBeenCalledTimes(1)
    })

    expect(requestMock).toHaveBeenCalledWith('/pre-registration', {
      body: expect.objectContaining({
        city: 'Paris',
        email: 'lea@example.com',
        firstName: 'Lea',
        lastName: 'Martin',
        password: 'StrongPass123!',
        phone: '0600000000',
        role: 'user',
        source: 'marketing_website',
        zipcode: '75011',
      }),
      method: 'POST',
    })

    await waitFor(() => {
      expect(trackEventMock).toHaveBeenCalledWith('form_submit', {
        form_name: 'pre_signup_client',
        role: 'user',
      })
    })
  })

  it('blocks provider submission when display name is missing', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <PreSignupForm
          ctaLabel="Je me pre-inscris en tant que pro"
          intro="intro"
          role="provider"
          title="title"
          trackingFormName="pre_signup_pro"
        />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Prenom/i), 'Lea')
    await user.type(screen.getByLabelText(/^Nom$/i), 'Martin')
    await user.type(screen.getByLabelText(/Email/i), 'lea@example.com')
    await user.type(screen.getByLabelText(/Mot de passe/i), 'StrongPass123!')
    await user.type(screen.getByLabelText(/Telephone/i), '0600000000')
    await user.type(screen.getByLabelText(/Ville/i), 'Paris')
    await user.type(screen.getByLabelText(/Code postal/i), '75011')
    await user.click(screen.getByRole('checkbox', { name: /J accepte/i }))
    await user.click(
      screen.getByRole('button', { name: /Je me pre-inscris en tant que pro/i })
    )

    expect(requestMock).not.toHaveBeenCalled()
    expect(trackEventMock).not.toHaveBeenCalled()
  })
})
