import type { ButtonHTMLAttributes } from 'react'
import { buttonClasses } from './buttonClasses'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export function Button({
  className,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  )
}
