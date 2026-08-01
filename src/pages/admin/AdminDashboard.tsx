import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import {
  AdminMetric,
  AdminPageHeader,
  AdminStatus,
} from '../../components/admin/AdminUi'
import { formatAdminDate, formatAdminMoney } from '../../lib/adminFormat'
import { fetchAdminDashboard, type AdminDashboard } from '../../lib/adminApi'
import { getAdminToken } from '../../lib/adminSession'

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const token = getAdminToken()
    if (!token) return
    fetchAdminDashboard(token)
      .then(setData)
      .catch((reason: Error) => setError(reason.message))
  }, [])

  return (
    <>
      <PageMeta
        title="Pilotage | Upper Glam"
        description="Tableau de bord d'administration Upper Glam."
        noIndex
      />
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Vue d’ensemble"
          title="Bonjour, voici l’essentiel."
        >
          Suivez l’activité de la plateforme et accédez immédiatement aux tâches
          qui demandent votre attention.
        </AdminPageHeader>
        {error && (
          <p
            className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AdminMetric
            label="Clientes"
            value={data?.users ?? '—'}
            detail="comptes inscrits"
          />
          <AdminMetric
            label="Prestataires"
            value={data?.providers ?? '—'}
            detail="profils créés"
          />
          <AdminMetric
            label="À examiner"
            value={data?.pendingPreRegistrations ?? '—'}
            detail="pré-inscriptions"
          />
          <AdminMetric
            label="Rendez-vous"
            value={data?.bookings.total ?? '—'}
            detail={data ? `${data.bookings.cancelled} annulé(s)` : undefined}
          />
          <AdminMetric
            label="Volume encaissé"
            value={data ? formatAdminMoney(data.revenueCents) : '—'}
            detail="paiements confirmés"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-2xl border border-black/7 bg-white p-5 shadow-[0_14px_40px_rgba(48,35,26,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#201a17]">
                  Dernières inscriptions
                </p>
                <p className="text-sm text-[#8c817a]">
                  Les comptes les plus récents
                </p>
              </div>
              <Link
                className="text-sm font-semibold text-[#8a6530] hover:underline"
                to="/admin/utilisateurs"
              >
                Tout voir
              </Link>
            </div>
            <div className="divide-y divide-black/6">
              {data?.recentRegistrations.map((user) => (
                <div
                  className="flex items-center justify-between gap-4 py-3"
                  key={user.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#201a17]">
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(' ') || user.email}
                    </p>
                    <p className="truncate text-xs text-[#8c817a]">
                      {user.email} · {formatAdminDate(user.createdAt)}
                    </p>
                  </div>
                  <AdminStatus status={user.status} />
                </div>
              ))}
              {!data && (
                <p className="py-8 text-sm text-[#8c817a]">
                  Chargement de l’activité…
                </p>
              )}
            </div>
          </section>
          <section className="rounded-2xl bg-[#241d19] p-6 text-[#f8f2eb]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#d7b476] uppercase">
              Priorité du jour
            </p>
            <p className="mt-4 font-serif text-3xl">
              {data?.pendingPreRegistrations ?? '—'} dossier(s)
            </p>
            <p className="mt-2 text-sm leading-6 text-[#cfc5bd]">
              à vérifier avant de permettre l’accès complet à la plateforme.
            </p>
            <Link
              className="mt-6 inline-flex rounded-full bg-[#d7b476] px-4 py-2.5 text-sm font-bold text-[#241d19]"
              to="/admin/pre-inscriptions"
            >
              Traiter les demandes
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
