import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
  AdminStatus,
} from '../../components/admin/AdminUi'
import { formatAdminMoney } from '../../lib/adminFormat'
import { PageMeta } from '../../components/common/PageMeta'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import {
  fetchAdminProviders,
  updateAdminProvider,
  type AdminAccountStatus,
  type AdminProvider,
} from '../../lib/adminApi'
import { getAdminToken } from '../../lib/adminSession'

const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Actifs', value: 'active' },
  { label: 'En attente', value: 'pending' },
  { label: 'Suspendus', value: 'suspended' },
]

export function AdminProvidersPage() {
  const [list, setList] = useState<AdminProvider[]>([])
  const [selected, setSelected] = useState<AdminProvider | null>(null)
  const [input, setInput] = useState('')
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
      const result = await fetchAdminProviders(token, {
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
          : 'Impossible de charger les prestataires.'
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
    setSearch(input.trim())
  }
  const update = async (changes: {
    isFeatured?: boolean
    status?: AdminAccountStatus
  }) => {
    const token = getAdminToken()
    if (!token || !selected) return
    setError('')
    setMessage('')
    try {
      const response = await updateAdminProvider(token, selected.id, changes)
      setMessage(response.message ?? 'Prestataire mis à jour.')
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Action impossible.')
    }
  }
  return (
    <>
      <PageMeta
        title="Prestataires | Upper Glam"
        description="Gestion des prestataires Upper Glam."
        noIndex
      />
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Réseau professionnel"
          title="Gestion des prestataires"
        >
          Pilotez la visibilité, l’accès et la performance de chaque
          professionnel présent sur Upper Glam.
        </AdminPageHeader>
        <form
          className="grid gap-3 rounded-2xl border border-black/7 bg-white p-4 sm:grid-cols-[1fr_220px_auto] sm:items-end"
          onSubmit={submit}
        >
          <Input
            label="Rechercher un prestataire"
            name="search"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Nom, ville ou e-mail"
            value={input}
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
              <span>{total} prestataire(s)</span>
              <span>{loading ? 'Actualisation…' : 'À jour'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-y border-black/7 bg-[#fbf8f4] text-xs tracking-wide text-[#756b65] uppercase">
                  <tr>
                    <th className="px-3 py-3">Prestataire</th>
                    <th className="px-3 py-3">Statut</th>
                    <th className="px-3 py-3">Note</th>
                    <th className="px-3 py-3">Réservations</th>
                    <th className="px-3 py-3">CA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {list.map((provider) => (
                    <tr
                      className={`cursor-pointer transition hover:bg-[#fbf8f4] ${selected?.id === provider.id ? 'bg-[#f8f1e7]' : ''}`}
                      key={provider.id}
                      onClick={() => setSelected(provider)}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#201a17]">
                            {provider.displayName}
                          </span>
                          {provider.isFeatured && (
                            <span className="rounded-full bg-[#241d19] px-2 py-0.5 text-[10px] font-bold text-[#f2ce8f] uppercase">
                              À la une
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8c817a]">
                          {provider.city} · {provider.email}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <AdminStatus status={provider.status} />
                      </td>
                      <td className="px-3 py-3">
                        {provider.ratingAvg.toFixed(1)}{' '}
                        <span className="text-xs text-[#8c817a]">
                          ({provider.ratingCount})
                        </span>
                      </td>
                      <td className="px-3 py-3">{provider.bookingsCount}</td>
                      <td className="px-3 py-3">
                        {formatAdminMoney(provider.revenueCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && !list.length && (
              <AdminEmpty>
                Aucun prestataire ne correspond à votre recherche.
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
                Sélectionnez un prestataire pour afficher sa fiche.
              </AdminEmpty>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-2xl text-[#201a17]">
                        {selected.displayName}
                      </p>
                      <p className="text-sm text-[#8c817a]">
                        {selected.city} · Profil #{selected.id}
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
                      {selected.servicesCount}
                    </p>
                    <p className="text-xs text-[#8c817a]">Services</p>
                  </div>
                  <div className="rounded-xl bg-[#fbf8f4] p-3">
                    <p className="text-xl font-semibold">
                      {selected.bookingsCount}
                    </p>
                    <p className="text-xs text-[#8c817a]">RDV</p>
                  </div>
                  <div className="rounded-xl bg-[#fbf8f4] p-3">
                    <p className="text-base font-semibold">
                      {formatAdminMoney(selected.revenueCents)}
                    </p>
                    <p className="text-xs text-[#8c817a]">CA</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-xl border border-black/7 p-4 text-sm">
                  <p>
                    <span className="text-[#8c817a]">À partir de :</span>{' '}
                    {selected.priceFromCents
                      ? formatAdminMoney(selected.priceFromCents)
                      : 'Non renseigné'}
                  </p>
                  <p>
                    <span className="text-[#8c817a]">Modes :</span>{' '}
                    {selected.serviceModes
                      .map((mode) =>
                        mode === 'home' ? 'À domicile' : 'En institut'
                      )
                      .join(', ') || 'Non renseigné'}
                  </p>
                  <p>
                    <span className="text-[#8c817a]">Adresse :</span>{' '}
                    {selected.instituteAddress || 'Non renseignée'}
                  </p>
                  {selected.bio && (
                    <p className="line-clamp-4 text-[#756b65]">
                      {selected.bio}
                    </p>
                  )}
                </div>
                <div className="border-t border-black/7 pt-5">
                  <p className="mb-3 text-xs font-bold tracking-wider text-[#8c817a] uppercase">
                    Mise en avant
                  </p>
                  <Button
                    onClick={() =>
                      void update({ isFeatured: !selected.isFeatured })
                    }
                    variant={selected.isFeatured ? 'secondary' : 'primary'}
                  >
                    {selected.isFeatured
                      ? 'Retirer de la une'
                      : 'Mettre à la une'}
                  </Button>
                </div>
                <div className="border-t border-black/7 pt-5">
                  <p className="mb-3 text-xs font-bold tracking-wider text-[#8c817a] uppercase">
                    Accès à la plateforme
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.status !== 'active' && (
                      <Button onClick={() => void update({ status: 'active' })}>
                        Activer
                      </Button>
                    )}
                    {selected.status !== 'suspended' && (
                      <Button
                        onClick={() => void update({ status: 'suspended' })}
                        variant="secondary"
                      >
                        Suspendre
                      </Button>
                    )}
                    {selected.status !== 'pending' && (
                      <Button
                        onClick={() => void update({ status: 'pending' })}
                        variant="secondary"
                      >
                        Mettre en attente
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
