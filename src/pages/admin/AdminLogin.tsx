import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import {
  ApiRequestError,
  assertAdminAccess,
  loginAdmin,
} from '../../lib/adminApi'
import {
  clearAdminSession,
  getAdminToken,
  setAdminSession,
} from '../../lib/adminSession'

function resolveNextPath(next: string | null) {
  if (!next) {
    return '/admin/pre-inscriptions'
  }

  if (!next.startsWith('/admin')) {
    return '/admin/pre-inscriptions'
  }

  return next
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const nextPath = resolveNextPath(searchParams.get('next'))

  useEffect(() => {
    const token = getAdminToken()
    if (token) {
      navigate(nextPath, { replace: true })
    }
  }, [navigate, nextPath])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')?.toString().trim() ?? ''
    const password = formData.get('password')?.toString() ?? ''

    try {
      const authData = await loginAdmin(email, password)
      setAdminSession(authData.token, email)

      try {
        await assertAdminAccess(authData.token)
      } catch (caughtError) {
        clearAdminSession()
        throw caughtError
      }

      navigate(nextPath, { replace: true })
    } catch (caughtError) {
      if (
        caughtError instanceof ApiRequestError &&
        caughtError.code === 'ADMIN_FORBIDDEN'
      ) {
        setError('Ce compte n a pas les droits administrateur.')
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Impossible de se connecter.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageMeta
        description="Connexion administrateur Upper Glam."
        title="Admin Login"
      />
      <div className="mx-auto max-w-md">
        <Card className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-3xl">Connexion admin</h2>
            <p className="text-sm text-[var(--ug-muted)]">
              Seuls les comptes admin peuvent acceder au back office.
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              autoComplete="email"
              label="Email"
              name="email"
              placeholder="admin@upperglam.fr"
              required
              type="email"
            />
            <Input
              autoComplete="current-password"
              label="Mot de passe"
              name="password"
              required
              type="password"
            />
            <Button
              className="w-full"
              disabled={isLoading}
              size="lg"
              type="submit"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </Card>
      </div>
    </>
  )
}
