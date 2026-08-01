import type { PropsWithChildren } from 'react'
import { cn } from './cn'

type CardProps = PropsWithChildren<{
  className?: string
}>

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--ug-radius)] border border-[var(--ug-border)] bg-[color:var(--ug-card-bg)] p-6 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
