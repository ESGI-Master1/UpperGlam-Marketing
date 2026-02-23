import { useEffect } from 'react'
import posthog from 'posthog-js'
import { useLocation, useNavigationType } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'

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

    posthog.capture('$pageview', pageViewProperties)
    trackEvent('page_view', pageViewProperties)
  }, [location.pathname, location.search, navigationType])

  return null
}
