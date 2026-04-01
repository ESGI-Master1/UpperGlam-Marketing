export type SupportedLocale = 'fr'

const apiErrorMessages: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    ADMIN_FORBIDDEN: 'Acces administrateur requis.',
    AUTH_EMAIL_ALREADY_USED: 'Cet email est deja utilise.',
    INVALID_ROLE: 'Role de pre-inscription invalide.',
    PRE_REGISTRATION_ALREADY_APPROVED:
      'Cette pre-inscription est deja approuvee.',
    PRE_REGISTRATION_ALREADY_REJECTED:
      'Cette pre-inscription est deja refusee.',
    PRE_REGISTRATION_ERROR:
      'Une erreur est survenue lors de la pre-inscription',
    PRE_REGISTRATION_NOT_FOUND: 'Pre-inscription introuvable.',
    VALIDATION_ERROR: 'Certaines donnees sont invalides.',
  },
}

export function getApiErrorMessage(
  errorCode?: string,
  locale: SupportedLocale = 'fr'
) {
  if (!errorCode) {
    return null
  }

  return apiErrorMessages[locale][errorCode] ?? null
}
