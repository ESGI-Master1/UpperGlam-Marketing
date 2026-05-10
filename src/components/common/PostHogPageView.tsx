import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { trackPageView } from '../../lib/analytics'

export function PostHogPageView() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    const pageViewProperties = {
      navigation_type: navigationType,
      pathname: location.pathname,
      search: location.search,
      url: window.location.href,
    }

    trackPageView(pageViewProperties)
  }, [location.pathname, location.search, navigationType])

  return null
}
