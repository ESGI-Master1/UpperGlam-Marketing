import type { PropsWithChildren } from 'react'
import { Container } from '../layout/Container'
import { cn } from './cn'

type SectionProps = PropsWithChildren<{
  className?: string
  id?: string
}>

export function Section({ children, className, id }: SectionProps) {
  return (
    <section className={cn('reveal-up py-10 sm:py-14', className)} id={id}>
      <Container>{children}</Container>
    </section>
  )
}
