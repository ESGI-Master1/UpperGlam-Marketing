import type { PropsWithChildren } from 'react'
import { cn } from './cn'

type BadgeProps = PropsWithChildren<{
  className?: string
}>

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--ug-border)] px-3 py-1 text-xs tracking-[0.16em] text-[var(--ug-muted)] uppercase',
        className
      )}
    >
      {children}
    </span>
  )
}
