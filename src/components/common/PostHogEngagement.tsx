import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent, trackSessionStart } from '../../lib/analytics'

const SCROLL_MILESTONES = [25, 50, 75, 90] as const

export function PostHogEngagement() {
  const location = useLocation()

  useEffect(() => {
    trackSessionStart()

    const engagedTimer = window.setTimeout(() => {
      trackEvent('page_engaged', {
        engagement_seconds: 15,
        pathname: location.pathname,
      })
    }, 15_000)

    const captured = new Set<number>()
    const trackScrollDepth = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const depth =
        scrollableHeight <= 0
          ? 100
          : Math.round((window.scrollY / scrollableHeight) * 100)

      for (const milestone of SCROLL_MILESTONES) {
        if (depth >= milestone && !captured.has(milestone)) {
          if (
            trackEvent('scroll_depth', {
              depth_percent: milestone,
              pathname: location.pathname,
            })
          ) {
            captured.add(milestone)
          }
        }
      }
    }

    window.addEventListener('scroll', trackScrollDepth, { passive: true })

    return () => {
      window.clearTimeout(engagedTimer)
      window.removeEventListener('scroll', trackScrollDepth)
    }
  }, [location.pathname])

  return null
}
