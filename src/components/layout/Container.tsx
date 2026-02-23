import type { PropsWithChildren } from 'react'
import { cn } from '../ui/cn'

type ContainerProps = PropsWithChildren<{
  className?: string
}>

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1120px] px-4 sm:px-6', className)}
    >
      {children}
    </div>
  )
}
