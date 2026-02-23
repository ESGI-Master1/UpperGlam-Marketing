import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'md' | 'lg'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ug-accent)]',
    variant === 'primary' &&
      'bg-[var(--ug-accent)] text-[var(--ug-text-dark)] hover:bg-[var(--ug-accent-hover)]',
    variant === 'secondary' &&
      'border border-[var(--ug-border)] bg-transparent text-[var(--ug-text)] hover:border-[var(--ug-accent)] hover:text-[var(--ug-accent)]',
    size === 'md' && 'px-5 py-3 text-sm',
    size === 'lg' && 'px-6 py-3.5 text-base',
    className
  )
}
