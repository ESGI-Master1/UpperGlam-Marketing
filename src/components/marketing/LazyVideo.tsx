import { useEffect, useRef } from 'react'

type LazyVideoProps = {
  ariaLabel: string
  className?: string
  height: number
  poster: string
  src: string
  width: number
}

export function LazyVideo({
  ariaLabel,
  className,
  height,
  poster,
  src,
  width,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        video.src = src
        video.load()
        void video.play().catch(() => undefined)
        observer.disconnect()
      },
      { rootMargin: '200px' }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [src])

  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      className={className}
      height={height}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      ref={videoRef}
      width={width}
    />
  )
}
