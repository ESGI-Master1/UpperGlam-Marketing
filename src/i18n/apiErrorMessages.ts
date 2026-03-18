export type SupportedLocale = 'fr'

const apiErrorMessages: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    PRE_REGISTRATION_ERROR:
      'Une erreur est survenue lors de la pre-inscription',
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
