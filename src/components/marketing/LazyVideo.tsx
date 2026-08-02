import { useEffect, useRef, type SyntheticEvent } from 'react'
import { trackEvent } from '../../lib/analytics'

type LazyVideoProps = {
  analyticsId: string
  ariaLabel: string
  className?: string
  height: number
  poster: string
  src: string
  width: number
}

export function LazyVideo({
  analyticsId,
  ariaLabel,
  className,
  height,
  poster,
  src,
  width,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const impressionTrackedRef = useRef(false)
  const playTrackedRef = useRef(false)
  const progressTrackedRef = useRef(new Set<number>())

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        video.src = src
        video.load()
        void video.play().catch(() => undefined)
        if (!impressionTrackedRef.current) {
          impressionTrackedRef.current = trackEvent('media_impression', {
            media_id: analyticsId,
            media_type: 'video',
          })
        }
        observer.disconnect()
      },
      { rootMargin: '200px' }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [analyticsId, src])

  const trackPlay = () => {
    if (playTrackedRef.current) return

    playTrackedRef.current = trackEvent('video_play', {
      media_id: analyticsId,
    })
  }

  const trackProgress = (event: SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime, duration } = event.currentTarget
    if (!Number.isFinite(duration) || duration <= 0) return

    const progress = (currentTime / duration) * 100
    for (const milestone of [50, 90]) {
      if (
        progress >= milestone &&
        !progressTrackedRef.current.has(milestone) &&
        trackEvent('video_progress', {
          media_id: analyticsId,
          percent: milestone,
        })
      ) {
        progressTrackedRef.current.add(milestone)
      }
    }
  }

  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      className={className}
      height={height}
      loop
      muted
      onPlay={trackPlay}
      onTimeUpdate={trackProgress}
      playsInline
      poster={poster}
      preload="none"
      ref={videoRef}
      width={width}
    />
  )
}
