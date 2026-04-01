import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAdminToken } from '../../lib/adminSession'

export function AdminRequireAuth() {
  const location = useLocation()
  const token = getAdminToken()

  if (!token) {
    const redirectPath = encodeURIComponent(
      `${location.pathname}${location.search}`
    )
    return <Navigate replace to={`/admin/login?next=${redirectPath}`} />
  }

  return <Outlet />
}
