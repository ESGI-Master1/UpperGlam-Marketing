import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminPreRegistrationsPage } from './AdminPreRegistrations'

const {
  fetchAdminPreRegistrationsMock,
  fetchAdminPreRegistrationByIdMock,
  fetchAdminAuditEventsMock,
  approveAdminPreRegistrationMock,
  rejectAdminPreRegistrationMock,
  clearAdminSessionMock,
  getAdminTokenMock,
} = vi.hoisted(() => ({
  fetchAdminPreRegistrationsMock: vi.fn(),
  fetchAdminPreRegistrationByIdMock: vi.fn(),
  fetchAdminAuditEventsMock: vi.fn(),
  approveAdminPreRegistrationMock: vi.fn(),
  rejectAdminPreRegistrationMock: vi.fn(),
  clearAdminSessionMock: vi.fn(),
  getAdminTokenMock: vi.fn(),
}))

vi.mock('../../lib/adminSession', () => ({
  clearAdminSession: clearAdminSessionMock,
  getAdminToken: getAdminTokenMock,
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
    approveAdminPreRegistration: approveAdminPreRegistrationMock,
    fetchAdminAuditEvents: fetchAdminAuditEventsMock,
    fetchAdminPreRegistrationById: fetchAdminPreRegistrationByIdMock,
    fetchAdminPreRegistrations: fetchAdminPreRegistrationsMock,
    rejectAdminPreRegistration: rejectAdminPreRegistrationMock,
  }
})

const sampleRecord = {
  accountStatus: 'pending',
  applicant: {
    city: 'Paris',
    email: 'lea@example.com',
    firstName: 'Lea',
    lastName: 'Martin',
    phone: '0600000000',
    username: 'leam',
    zipcode: '75011',
  },
  createdAt: '2026-05-11T08:00:00.000Z',
  id: 1,
  marketing: {
    comment: 'hello',
    interest: 'coiffure',
    optIn: true,
    source: 'marketing_website',
  },
  preferences: {
    desiredServices: ['coiffure'],
    preferredBudgetCents: 7000,
    preferredServiceModes: ['home'],
  },
  providerProfile: null,
  review: {
    rejectionReason: null,
    reviewedAt: null,
    reviewedByEmail: null,
    reviewedByUserId: null,
    status: 'submitted',
  },
  role: 'user',
  updatedAt: '2026-05-11T09:00:00.000Z',
  userId: 42,
}

const secondRecord = {
  ...sampleRecord,
  applicant: {
    ...sampleRecord.applicant,
    email: 'noa@example.com',
    firstName: 'Noa',
    lastName: 'Durand',
  },
  id: 2,
  userId: 43,
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/pre-inscriptions']}>
      <Routes>
        <Route
          path="/admin/pre-inscriptions"
          element={<AdminPreRegistrationsPage />}
        />
        <Route path="/admin/login" element={<div>login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminPreRegistrationsPage critical actions', () => {
  beforeEach(() => {
    fetchAdminPreRegistrationsMock.mockReset()
    fetchAdminPreRegistrationByIdMock.mockReset()
    fetchAdminAuditEventsMock.mockReset()
    approveAdminPreRegistrationMock.mockReset()
    rejectAdminPreRegistrationMock.mockReset()
    clearAdminSessionMock.mockReset()
    getAdminTokenMock.mockReset()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    getAdminTokenMock.mockReturnValue('token-abc')
    fetchAdminPreRegistrationsMock.mockResolvedValue({
      data: [sampleRecord],
      meta: { limit: 20, page: 1, total: 1 },
    })
    fetchAdminPreRegistrationByIdMock.mockResolvedValue(sampleRecord)
    fetchAdminAuditEventsMock.mockResolvedValue({
      data: [
        {
          action: 'admin.pre_registration.approved',
          adminEmail: 'admin@upperglam.fr',
          adminUserId: 7,
          createdAt: '2026-07-14T12:00:00.000Z',
          details: { targetUserId: 42 },
          id: 10,
          preRegistrationId: 1,
        },
      ],
      meta: { limit: 10, page: 1, total: 1 },
    })
    approveAdminPreRegistrationMock.mockResolvedValue({ message: 'approved' })
    rejectAdminPreRegistrationMock.mockResolvedValue({ message: 'rejected' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('approves and rejects selected pre-registration', async () => {
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(fetchAdminPreRegistrationsMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Approuver/i })
      ).toBeInTheDocument()
    })
    expect(
      await screen.findByText(/admin.pre_registration.approved/i)
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Approuver/i }))

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        "Confirmer l'approbation du dossier #1 - Lea Martin ?"
      )
      expect(approveAdminPreRegistrationMock).toHaveBeenCalledWith(
        'token-abc',
        1
      )
      expect(fetchAdminAuditEventsMock).toHaveBeenCalledWith('token-abc', {
        limit: 10,
        page: 1,
        preRegistrationId: 1,
      })
    })

    await user.type(
      screen.getByLabelText(/Motif de refus/i),
      'Informations manquantes'
    )
    await user.click(screen.getByRole('button', { name: /Refuser/i }))

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        'Confirmer le refus du dossier #1 - Lea Martin ?'
      )
      expect(rejectAdminPreRegistrationMock).toHaveBeenCalledWith(
        'token-abc',
        1,
        'Informations manquantes'
      )
    })
  })

  it('does not run sensitive actions when confirmation is cancelled', async () => {
    vi.mocked(window.confirm).mockReturnValue(false)
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Approuver/i })
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Approuver/i }))
    await user.type(
      screen.getByLabelText(/Motif de refus/i),
      'Informations manquantes'
    )
    await user.click(screen.getByRole('button', { name: /Refuser/i }))

    expect(approveAdminPreRegistrationMock).not.toHaveBeenCalled()
    expect(rejectAdminPreRegistrationMock).not.toHaveBeenCalled()
  })

  it('keeps rejection disabled until a reason is provided', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Refuser/i })).toBeDisabled()
    })

    expect(rejectAdminPreRegistrationMock).not.toHaveBeenCalled()
  })

  it('shows empty, loading and error states', async () => {
    fetchAdminPreRegistrationsMock.mockImplementationOnce(
      () => new Promise(() => undefined)
    )
    const { unmount } = renderPage()

    expect(await screen.findByRole('status')).toHaveTextContent(/Chargement/i)
    unmount()

    fetchAdminPreRegistrationsMock.mockResolvedValueOnce({
      data: [],
      meta: { limit: 20, page: 1, total: 0 },
    })
    renderPage()

    expect(
      await screen.findByText(/Aucun dossier ne correspond aux filtres/i)
    ).toBeInTheDocument()
    unmount()

    fetchAdminPreRegistrationsMock.mockRejectedValueOnce(
      new Error('Impossible de charger')
    )
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Impossible de charger/i
    )
  })

  it('redirects to login and clears session on forbidden API response', async () => {
    const { ApiRequestError } = await import('../../lib/adminApi')
    fetchAdminPreRegistrationsMock.mockRejectedValueOnce(
      new ApiRequestError({
        code: 'FORBIDDEN',
        message: 'forbidden',
        status: 403,
      })
    )

    renderPage()

    expect(await screen.findByText('login')).toBeInTheDocument()
    expect(clearAdminSessionMock).toHaveBeenCalledTimes(1)
  })

  it('can select another record from the list with keyboard', async () => {
    fetchAdminPreRegistrationsMock.mockResolvedValueOnce({
      data: [sampleRecord, secondRecord],
      meta: { limit: 20, page: 1, total: 2 },
    })
    fetchAdminPreRegistrationByIdMock.mockImplementation((_token, id) =>
      Promise.resolve(id === 2 ? secondRecord : sampleRecord)
    )
    const user = userEvent.setup()

    renderPage()

    const secondRow = await screen.findByText('Noa Durand')
    await user.tab()
    await user.keyboard('{Enter}')
    secondRow.closest('tr')?.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(fetchAdminPreRegistrationByIdMock).toHaveBeenCalledWith(
        'token-abc',
        2
      )
    })
  })
})
