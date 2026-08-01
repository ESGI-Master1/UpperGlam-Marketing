import { getApiErrorMessage } from '../i18n/apiErrorMessages'

const backendUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL.replace(/\/+$/, '')

export type AdminRole = 'provider' | 'user'
export type AdminAccountStatus = 'active' | 'pending' | 'suspended'
export type AdminReviewStatus =
  | 'approved'
  | 'in_review'
  | 'rejected'
  | 'submitted'
export type ServiceMode = 'home' | 'institute'

export type AdminDashboard = {
  bookings: { cancelled: number; paid: number; total: number }
  pendingPreRegistrations: number
  providers: number
  recentRegistrations: Array<{
    createdAt: string
    email: string
    firstName: string | null
    id: number
    lastName: string | null
    status: AdminAccountStatus
  }>
  revenueCents: number
  users: number
}

export type AdminUser = {
  bookingsCount: number
  createdAt: string
  email: string
  firstName: string | null
  id: number
  lastName: string | null
  phone: string | null
  reviewsCount: number
  spentCents: number
  status: AdminAccountStatus
}

export type AdminProvider = {
  bio: string | null
  bookingsCount: number
  city: string
  createdAt: string
  currency: string
  displayName: string
  email: string
  firstName: string | null
  id: number
  instituteAddress: string | null
  isFeatured: boolean
  lastName: string | null
  phone: string | null
  priceFromCents: number | null
  ratingAvg: number
  ratingCount: number
  revenueCents: number
  serviceModes: ServiceMode[]
  servicesCount: number
  status: AdminAccountStatus
  userId: number
}

export type AdminAuditEvent = {
  action: string
  adminEmail: string | null
  adminUserId: number | null
  createdAt: string
  details: unknown
  id: number
  preRegistrationId: number | null
}

export type AdminPreRegistration = {
  accountStatus: AdminAccountStatus
  applicant: {
    city: string
    email: string
    firstName: string
    lastName: string
    phone: string
    username: string | null
    zipcode: string
  }
  createdAt: string
  id: number
  marketing: {
    comment: string | null
    interest: string | null
    optIn: boolean
    source: string | null
  }
  preferences: {
    desiredServices: string[] | null
    preferredBudgetCents: number | null
    preferredServiceModes: ServiceMode[] | null
  } | null
  providerProfile: {
    businessName: string | null
    displayName: string
    hasCertification: boolean | null
    instagramUrl: string | null
    instituteAddress: string | null
    priceFromCents: number | null
    serviceModes: ServiceMode[] | null
    specialties: string[] | null
    tiktokUrl: string | null
    yearsExperience: number | null
  } | null
  review: {
    rejectionReason: string | null
    reviewedAt: string | null
    reviewedByEmail: string | null
    reviewedByUserId: number | null
    status: AdminReviewStatus
  }
  role: AdminRole
  updatedAt: string
  userId: number
}

type ApiEnvelope<TData> = {
  data: TData
  message?: string
  meta?: {
    limit: number
    page: number
    total: number
  }
}

type ApiErrorPayload = {
  error?:
    | {
        code?: string
        details?: unknown
        message?: string
      }
    | string
  message?: string
}

export class ApiRequestError extends Error {
  code?: string
  details?: unknown
  status: number

  constructor({
    code,
    details,
    message,
    status,
  }: {
    code?: string
    details?: unknown
    message: string
    status: number
  }) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function buildUrl(path: string, query?: Record<string, string | number>) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${backendUrl}${normalizedPath}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function requestApi<TData>({
  body,
  method = 'GET',
  path,
  query,
  token,
}: {
  body?: unknown
  method?: 'GET' | 'PATCH' | 'POST'
  path: string
  query?: Record<string, string | number>
  token?: string
}) {
  const response = await fetch(buildUrl(path, query), {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method,
  })

  const raw = await response.text()
  const parsed = raw
    ? (JSON.parse(raw) as ApiEnvelope<TData> | ApiErrorPayload)
    : null

  if (!response.ok) {
    const rawError = (parsed as ApiErrorPayload | null)?.error
    const code = typeof rawError === 'string' ? rawError : rawError?.code
    const details = typeof rawError === 'string' ? undefined : rawError?.details
    const resolvedMessage = getApiErrorMessage(code)
    const message =
      resolvedMessage ??
      (typeof rawError === 'string' ? undefined : rawError?.message) ??
      (parsed as ApiErrorPayload | null)?.message ??
      'Une erreur est survenue lors de la requete.'

    throw new ApiRequestError({
      code,
      details,
      message,
      status: response.status,
    })
  }

  return parsed as ApiEnvelope<TData>
}

export async function loginAdmin(email: string, password: string) {
  const response = await requestApi<{
    expiresAt: string
    token: string
    user: {
      email: string
      id: number
    }
  }>({
    body: {
      deviceName: 'upperglam-admin-web',
      email,
      password,
    },
    method: 'POST',
    path: '/auth/login',
  })

  return response.data
}

export async function assertAdminAccess(token: string) {
  await requestApi<AdminDashboard>({ path: '/admin/dashboard', token })
}

export async function fetchAdminDashboard(token: string) {
  return (await requestApi<AdminDashboard>({ path: '/admin/dashboard', token }))
    .data
}

function buildManagementQuery(params: {
  featured?: boolean
  limit: number
  page: number
  search?: string
  status?: AdminAccountStatus
}) {
  const query: Record<string, string | number> = {
    limit: params.limit,
    page: params.page,
  }
  if (params.search) query.search = params.search
  if (params.status) query.status = params.status
  if (params.featured !== undefined) query.featured = String(params.featured)
  return query
}

export async function fetchAdminUsers(
  token: string,
  params: {
    limit: number
    page: number
    search?: string
    status?: AdminAccountStatus
  }
) {
  const response = await requestApi<AdminUser[]>({
    path: '/admin/users',
    query: buildManagementQuery(params),
    token,
  })
  return { data: response.data, meta: response.meta! }
}

export async function updateAdminUserStatus(
  token: string,
  userId: number,
  status: AdminAccountStatus
) {
  return requestApi<{ id: number; status: AdminAccountStatus }>({
    body: { status },
    method: 'PATCH',
    path: `/admin/users/${userId}/status`,
    token,
  })
}

export async function fetchAdminProviders(
  token: string,
  params: {
    featured?: boolean
    limit: number
    page: number
    search?: string
    status?: AdminAccountStatus
  }
) {
  const response = await requestApi<AdminProvider[]>({
    path: '/admin/providers',
    query: buildManagementQuery(params),
    token,
  })
  return { data: response.data, meta: response.meta! }
}

export async function updateAdminProvider(
  token: string,
  providerId: number,
  changes: { isFeatured?: boolean; status?: AdminAccountStatus }
) {
  return requestApi<{
    id: number
    isFeatured: boolean
    status: AdminAccountStatus
  }>({
    body: changes,
    method: 'PATCH',
    path: `/admin/providers/${providerId}`,
    token,
  })
}

export async function fetchAdminPreRegistrations(
  token: string,
  params: {
    accountStatus?: AdminAccountStatus
    limit: number
    page: number
    reviewStatus?: AdminReviewStatus
    role?: AdminRole
    search?: string
  }
) {
  const query: Record<string, string | number> = {
    limit: params.limit,
    page: params.page,
  }

  if (params.role) {
    query.role = params.role
  }
  if (params.reviewStatus) {
    query.reviewStatus = params.reviewStatus
  }
  if (params.accountStatus) {
    query.accountStatus = params.accountStatus
  }
  if (params.search) {
    query.search = params.search
  }

  const response = await requestApi<AdminPreRegistration[]>({
    path: '/admin/pre-registrations',
    query,
    token,
  })

  return {
    data: response.data,
    meta: response.meta ?? {
      limit: params.limit,
      page: params.page,
      total: response.data.length,
    },
  }
}

export async function fetchAdminPreRegistrationById(
  token: string,
  preRegistrationId: number
) {
  const response = await requestApi<AdminPreRegistration>({
    path: `/admin/pre-registrations/${preRegistrationId}`,
    token,
  })

  return response.data
}

export async function fetchAdminAuditEvents(
  token: string,
  params: {
    limit: number
    page: number
    preRegistrationId?: number
  }
) {
  const query: Record<string, string | number> = {
    limit: params.limit,
    page: params.page,
  }

  if (params.preRegistrationId) {
    query.preRegistrationId = params.preRegistrationId
  }

  const response = await requestApi<AdminAuditEvent[]>({
    path: '/admin/audit-events',
    query,
    token,
  })

  return {
    data: response.data,
    meta: response.meta ?? {
      limit: params.limit,
      page: params.page,
      total: response.data.length,
    },
  }
}

export async function approveAdminPreRegistration(
  token: string,
  preRegistrationId: number
) {
  const response = await requestApi<{
    id: number
    mailSent: boolean
  }>({
    method: 'POST',
    path: `/admin/pre-registrations/${preRegistrationId}/approve`,
    token,
  })

  return response
}

export async function rejectAdminPreRegistration(
  token: string,
  preRegistrationId: number,
  reason: string
) {
  const response = await requestApi<{ id: number }>({
    body: { reason },
    method: 'POST',
    path: `/admin/pre-registrations/${preRegistrationId}/reject`,
    token,
  })

  return response
}
