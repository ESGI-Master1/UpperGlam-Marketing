import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactPage } from './Contact'

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}))

vi.mock('../lib/analytics', () => ({
  trackEvent: trackEventMock,
}))

describe('ContactPage critical flow', () => {
  beforeEach(() => {
    trackEventMock.mockReset()
  })

  it('submits contact form and displays confirmation state', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )

    await user.selectOptions(screen.getByLabelText(/Profil/i), 'pro')
    await user.type(screen.getByLabelText(/^Nom$/i), 'Lea Martin')
    await user.type(screen.getByLabelText(/Email/i), 'lea@example.com')
    await user.type(
      screen.getByLabelText(/Message/i),
      'Bonjour, je souhaite plus d informations.'
    )
    await user.click(screen.getByRole('button', { name: /Envoyer/i }))

    expect(trackEventMock).toHaveBeenCalledWith('form_submit', {
      form_name: 'contact',
      role: 'pro',
    })
    expect(screen.getByText(/Votre message est prêt/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Ouvrir ma messagerie/i })
    ).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })
})
