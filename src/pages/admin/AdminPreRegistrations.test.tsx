import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminPreRegistrationsPage } from './AdminPreRegistrations'

const {
  fetchAdminPreRegistrationsMock,
  fetchAdminPreRegistrationByIdMock,
  approveAdminPreRegistrationMock,
  rejectAdminPreRegistrationMock,
  clearAdminSessionMock,
  getAdminTokenMock,
} = vi.hoisted(() => ({
  fetchAdminPreRegistrationsMock: vi.fn(),
  fetchAdminPreRegistrationByIdMock: vi.fn(),
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

describe('AdminPreRegistrationsPage critical actions', () => {
  beforeEach(() => {
    fetchAdminPreRegistrationsMock.mockReset()
    fetchAdminPreRegistrationByIdMock.mockReset()
    approveAdminPreRegistrationMock.mockReset()
    rejectAdminPreRegistrationMock.mockReset()
    clearAdminSessionMock.mockReset()
    getAdminTokenMock.mockReset()

    getAdminTokenMock.mockReturnValue('token-abc')
    fetchAdminPreRegistrationsMock.mockResolvedValue({
      data: [sampleRecord],
      meta: { limit: 20, page: 1, total: 1 },
    })
    fetchAdminPreRegistrationByIdMock.mockResolvedValue(sampleRecord)
    approveAdminPreRegistrationMock.mockResolvedValue({ message: 'approved' })
    rejectAdminPreRegistrationMock.mockResolvedValue({ message: 'rejected' })
  })

  it('approves and rejects selected pre-registration', async () => {
    const user = userEvent.setup()

    render(
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

    await waitFor(() => {
      expect(fetchAdminPreRegistrationsMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Approuver/i })
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Approuver/i }))

    await waitFor(() => {
      expect(approveAdminPreRegistrationMock).toHaveBeenCalledWith(
        'token-abc',
        1
      )
    })

    await user.type(
      screen.getByLabelText(/Motif de refus/i),
      'Informations manquantes'
    )
    await user.click(screen.getByRole('button', { name: /Refuser/i }))

    await waitFor(() => {
      expect(rejectAdminPreRegistrationMock).toHaveBeenCalledWith(
        'token-abc',
        1,
        'Informations manquantes'
      )
    })
  })
})
