const ADMIN_TOKEN_STORAGE_KEY = 'ug_admin_token'
const ADMIN_EMAIL_STORAGE_KEY = 'ug_admin_email'

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
}

export function getAdminEmail() {
  return window.localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY)
}

export function setAdminSession(token: string, email: string) {
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
  window.localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, email)
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY)
}
