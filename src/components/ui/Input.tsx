import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from './cn'

type BaseProps = {
  className?: string
  label: string
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>

const inputBaseClasses =
  'w-full rounded-2xl border border-[var(--ug-border)] bg-[color:var(--ug-input-bg)] px-4 py-3 text-sm text-[var(--ug-text)] outline-none transition-colors placeholder:text-[color:rgba(18,18,18,0.45)] focus:border-[var(--ug-accent)]'

export function Input({ className, label, ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-[var(--ug-muted)]">{label}</span>
      <input className={cn(inputBaseClasses, className)} {...props} />
    </label>
  )
}

export function Textarea({ className, label, ...props }: TextareaProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-[var(--ug-muted)]">{label}</span>
      <textarea
        className={cn(inputBaseClasses, className)}
        rows={5}
        {...props}
      />
    </label>
  )
}
