import type { PropsWithChildren, ReactNode } from 'react'
import { Button } from '../ui/Button'
import type { AdminAccountStatus } from '../../lib/adminApi'

const statusLabels: Record<AdminAccountStatus, string> = {
  active: 'Actif',
  pending: 'En attente',
  suspended: 'Suspendu',
}

export function AdminStatus({ status }: { status: AdminAccountStatus }) {
  const colors = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    suspended: 'border-rose-200 bg-rose-50 text-rose-700',
  }
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

export function AdminPageHeader({
  action,
  eyebrow,
  title,
  children,
}: PropsWithChildren<{ action?: ReactNode; eyebrow: string; title: string }>) {
  return (
    <div className="flex flex-col gap-4 border-b border-black/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#9a753b] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl leading-tight text-[#201a17] sm:text-4xl">
          {title}
        </h1>
        {children && (
          <p className="mt-2 text-sm leading-6 text-[#756b65]">{children}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function AdminMetric({
  label,
  value,
  detail,
}: {
  detail?: string
  label: string
  value: string | number
}) {
  return (
    <article className="rounded-2xl border border-black/7 bg-white p-5 shadow-[0_14px_40px_rgba(48,35,26,0.05)]">
      <p className="text-xs font-semibold tracking-[0.12em] text-[#8c817a] uppercase">
        {label}
      </p>
      <p className="mt-3 font-serif text-3xl text-[#201a17]">{value}</p>
      {detail && <p className="mt-2 text-xs text-[#8c817a]">{detail}</p>}
    </article>
  )
}

export function AdminPagination({
  loading,
  page,
  pageCount,
  setPage,
}: {
  loading: boolean
  page: number
  pageCount: number
  setPage: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between border-t border-black/7 pt-4">
      <p className="text-sm text-[#756b65]">
        Page {page} sur {pageCount}
      </p>
      <div className="flex gap-2">
        <Button
          disabled={loading || page <= 1}
          onClick={() => setPage(page - 1)}
          variant="secondary"
        >
          Précédent
        </Button>
        <Button
          disabled={loading || page >= pageCount}
          onClick={() => setPage(page + 1)}
          variant="secondary"
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}

export function AdminEmpty({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-dashed border-black/12 px-6 py-12 text-center text-sm text-[#756b65]">
      {children}
    </div>
  )
}
