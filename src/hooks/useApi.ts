import { useCallback, useState } from 'react'
import {
  getApiErrorMessage,
  type SupportedLocale,
} from '../i18n/apiErrorMessages'

const backendUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL.replace(/\/+$/, '')

type ApiErrorPayload = {
  error?: string
  message?: string
}

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${backendUrl}${normalizedPath}`
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(
    async <TResponse, TBody = unknown>(
      path: string,
      options?: {
        body?: TBody
        headers?: HeadersInit
        locale?: SupportedLocale
        method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
      }
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(buildUrl(path), {
          body: options?.body ? JSON.stringify(options.body) : undefined,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          method: options?.method ?? 'GET',
        })

        const raw = await response.text()
        let data: TResponse | ApiErrorPayload | null = null

        if (raw) {
          try {
            data = JSON.parse(raw) as TResponse | ApiErrorPayload
          } catch {
            data = null
          }
        }

        if (!response.ok) {
          const resolvedMessage = getApiErrorMessage(
            (data as ApiErrorPayload | null)?.error,
            options?.locale
          )
          const message =
            resolvedMessage ??
            (data as ApiErrorPayload | null)?.message ??
            'Une erreur est survenue lors de la requete.'
          throw new Error(message)
        }

        return data as TResponse
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Une erreur est survenue lors de la requete.'
        setError(message)
        throw caughtError
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    error,
    isLoading,
    request,
  }
}
