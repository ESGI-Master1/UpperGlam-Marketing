import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
  AdminStatus,
} from '../../components/admin/AdminUi'
import { formatAdminDate, formatAdminMoney } from '../../lib/adminFormat'
import { PageMeta } from '../../components/common/PageMeta'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import {
  fetchAdminUsers,
  updateAdminUserStatus,
  type AdminAccountStatus,
  type AdminUser,
} from '../../lib/adminApi'
import { getAdminToken } from '../../lib/adminSession'

const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Actifs', value: 'active' },
  { label: 'En attente', value: 'pending' },
  { label: 'Suspendus', value: 'suspended' },
]

export function AdminUsersPage() {
  const [list, setList] = useState<AdminUser[]>([])
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | AdminAccountStatus>('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const limit = 15

  const load = useCallback(async () => {
    const token = getAdminToken()
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const result = await fetchAdminUsers(token, {
        limit,
        page,
        search: search || undefined,
        status: status || undefined,
      })
      setList(result.data)
      setTotal(result.meta.total)
      setSelected(
        (current) =>
          result.data.find((item) => item.id === current?.id) ??
          result.data[0] ??
          null
      )
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Impossible de charger les clientes.'
      )
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    void load()
  }, [load])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }
  const changeStatus = async (next: AdminAccountStatus) => {
    const token = getAdminToken()
    if (!token || !selected) return
    setError('')
    setMessage('')
    try {
      const response = await updateAdminUserStatus(token, selected.id, next)
      setMessage(response.message ?? 'Compte mis à jour.')
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Action impossible.')
    }
  }

  return (
    <>
      <PageMeta
        title="Clientes | Upper Glam"
        description="Gestion des clientes Upper Glam."
        noIndex
      />
      <div className="space-y-6">
        <AdminPageHeader eyebrow="Communauté" title="Gestion des clientes">
          Retrouvez les coordonnées, l’activité et le statut de chaque compte
          depuis une seule vue.
        </AdminPageHeader>
        <form
          className="grid gap-3 rounded-2xl border border-black/7 bg-white p-4 sm:grid-cols-[1fr_220px_auto] sm:items-end"
          onSubmit={submit}
        >
          <Input
            label="Rechercher une cliente"
            name="search"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Nom, e-mail ou téléphone"
            value={searchInput}
          />
          <Select
            label="Statut du compte"
            onChange={(event) => {
              setStatus(event.target.value as '' | AdminAccountStatus)
              setPage(1)
            }}
            options={statusOptions}
            value={status}
          />
          <Button type="submit">Rechercher</Button>
        </form>
        {error && (
          <p
            className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
            role="alert"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
            role="status"
          >
            {message}
          </p>
        )}
        <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
          <section className="space-y-4 rounded-2xl border border-black/7 bg-white p-5">
            <div className="flex justify-between text-sm text-[#756b65]">
              <span>{total} cliente(s)</span>
              <span>{loading ? 'Actualisation…' : 'À jour'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[690px] text-left text-sm">
                <thead className="border-y border-black/7 bg-[#fbf8f4] text-xs tracking-wide text-[#756b65] uppercase">
                  <tr>
                    <th className="px-3 py-3">Cliente</th>
                    <th className="px-3 py-3">Statut</th>
                    <th className="px-3 py-3">Rendez-vous</th>
                    <th className="px-3 py-3">Dépensé</th>
                    <th className="px-3 py-3">Inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {list.map((user) => (
                    <tr
                      className={`cursor-pointer transition hover:bg-[#fbf8f4] ${selected?.id === user.id ? 'bg-[#f8f1e7]' : ''}`}
                      key={user.id}
                      onClick={() => setSelected(user)}
                    >
                      <td className="px-3 py-3">
                        <p className="font-semibold text-[#201a17]">
                          {[user.firstName, user.lastName]
                            .filter(Boolean)
                            .join(' ') || 'Profil à compléter'}
                        </p>
                        <p className="text-xs text-[#8c817a]">{user.email}</p>
                      </td>
                      <td className="px-3 py-3">
                        <AdminStatus status={user.status} />
                      </td>
                      <td className="px-3 py-3">{user.bookingsCount}</td>
                      <td className="px-3 py-3">
                        {formatAdminMoney(user.spentCents)}
                      </td>
                      <td className="px-3 py-3 text-[#756b65]">
                        {formatAdminDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && !list.length && (
              <AdminEmpty>
                Aucune cliente ne correspond à votre recherche.
              </AdminEmpty>
            )}
            <AdminPagination
              loading={loading}
              page={page}
              pageCount={Math.max(1, Math.ceil(total / limit))}
              setPage={setPage}
            />
          </section>
          <aside className="h-fit rounded-2xl border border-black/7 bg-white p-5 xl:sticky xl:top-6">
            {!selected ? (
              <AdminEmpty>
                Sélectionnez une cliente pour afficher sa fiche.
              </AdminEmpty>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-2xl text-[#201a17]">
                        {[selected.firstName, selected.lastName]
                          .filter(Boolean)
                          .join(' ') || 'Profil à compléter'}
                      </p>
                      <p className="text-sm text-[#8c817a]">
                        Cliente #{selected.id}
                      </p>
                    </div>
                    <AdminStatus status={selected.status} />
                  </div>
                  <p className="text-sm text-[#4f4640]">{selected.email}</p>
                  <p className="text-sm text-[#756b65]">
                    {selected.phone || 'Téléphone non renseigné'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-[#fbf8f4] p-3">
                    <p className="text-xl font-semibold">
                      {selected.bookingsCount}
                    </p>
                    <p className="text-xs text-[#8c817a]">RDV</p>
                  </div>
                  <div className="rounded-xl bg-[#fbf8f4] p-3">
                    <p className="text-xl font-semibold">
                      {selected.reviewsCount}
                    </p>
                    <p className="text-xs text-[#8c817a]">Avis</p>
                  </div>
                  <div className="rounded-xl bg-[#fbf8f4] p-3">
                    <p className="text-base font-semibold">
                      {formatAdminMoney(selected.spentCents)}
                    </p>
                    <p className="text-xs text-[#8c817a]">Dépensé</p>
                  </div>
                </div>
                <div className="border-t border-black/7 pt-5">
                  <p className="mb-3 text-xs font-bold tracking-wider text-[#8c817a] uppercase">
                    Gestion du compte
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.status !== 'active' && (
                      <Button onClick={() => void changeStatus('active')}>
                        Activer le compte
                      </Button>
                    )}
                    {selected.status !== 'suspended' && (
                      <Button
                        onClick={() => void changeStatus('suspended')}
                        variant="secondary"
                      >
                        Suspendre
                      </Button>
                    )}
                    {selected.status !== 'pending' && (
                      <Button
                        onClick={() => void changeStatus('pending')}
                        variant="secondary"
                      >
                        Remettre en attente
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
