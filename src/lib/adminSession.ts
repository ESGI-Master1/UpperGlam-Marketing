const ADMIN_TOKEN_STORAGE_KEY = 'ug_admin_token'
const ADMIN_EMAIL_STORAGE_KEY = 'ug_admin_email'
const ADMIN_EXPIRES_AT_STORAGE_KEY = 'ug_admin_expires_at'

function isExpired(expiresAt: string | null) {
  return Boolean(expiresAt && Date.parse(expiresAt) <= Date.now())
}

export function getAdminToken() {
  const expiresAt = window.localStorage.getItem(ADMIN_EXPIRES_AT_STORAGE_KEY)
  if (isExpired(expiresAt)) {
    clearAdminSession()
    return null
  }

  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
}

export function getAdminEmail() {
  if (!getAdminToken()) {
    return null
  }

  return window.localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY)
}

export function getAdminSessionExpiresAt() {
  if (!getAdminToken()) {
    return null
  }

  return window.localStorage.getItem(ADMIN_EXPIRES_AT_STORAGE_KEY)
}

export function setAdminSession(
  token: string,
  email: string,
  expiresAt: string
) {
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
  window.localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, email)
  window.localStorage.setItem(ADMIN_EXPIRES_AT_STORAGE_KEY, expiresAt)
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY)
  window.localStorage.removeItem(ADMIN_EXPIRES_AT_STORAGE_KEY)
}
