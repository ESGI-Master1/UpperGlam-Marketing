import type { SelectHTMLAttributes } from 'react'
import { cn } from './cn'

type SelectProps = {
  label: string
  options: Array<{ label: string; value: string }>
} & SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, label, options, ...props }: SelectProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-[var(--ug-muted)]">{label}</span>
      <select
        className={cn(
          'w-full rounded-2xl border border-[var(--ug-border)] bg-[color:var(--ug-input-bg)] px-4 py-3 text-sm text-[var(--ug-text)] transition-colors outline-none focus:border-[var(--ug-accent)]',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            className="bg-[var(--ug-surface)] text-[var(--ug-text)]"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
