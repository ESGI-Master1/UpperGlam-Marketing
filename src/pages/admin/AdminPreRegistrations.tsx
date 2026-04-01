import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import {
  ApiRequestError,
  approveAdminPreRegistration,
  fetchAdminPreRegistrationById,
  fetchAdminPreRegistrations,
  rejectAdminPreRegistration,
  type AdminAccountStatus,
  type AdminPreRegistration,
  type AdminReviewStatus,
  type AdminRole,
} from '../../lib/adminApi'
import { clearAdminSession, getAdminToken } from '../../lib/adminSession'

type FiltersState = {
  accountStatus: '' | AdminAccountStatus
  reviewStatus: '' | AdminReviewStatus
  role: '' | AdminRole
  search: string
}

const roleOptions = [
  { label: 'Tous les roles', value: '' },
  { label: 'Particulier', value: 'user' },
  { label: 'Prestataire', value: 'provider' },
]

const reviewStatusOptions = [
  { label: 'Tous les statuts dossier', value: '' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'In review', value: 'in_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const accountStatusOptions = [
  { label: 'Tous les statuts compte', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
]

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('fr-FR')
}

function formatCents(value: number | null) {
  if (!value || value <= 0) {
    return '-'
  }

  return new Intl.NumberFormat('fr-FR', {
    currency: 'EUR',
    style: 'currency',
  }).format(value / 100)
}

function displayText(value: string | null | undefined) {
  if (!value) {
    return '-'
  }

  return value
}

export function AdminPreRegistrationsPage() {
  const token = getAdminToken()
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState<FiltersState>({
    accountStatus: '',
    reviewStatus: '',
    role: '',
    search: '',
  })
  const [page, setPage] = useState(1)
  const [list, setList] = useState<AdminPreRegistration[]>([])
  const [meta, setMeta] = useState({
    limit: 20,
    page: 1,
    total: 0,
  })
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<AdminPreRegistration | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [rejectReason, setRejectReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  const redirectToLogin = useCallback(() => {
    clearAdminSession()
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    navigate(`/admin/login?next=${next}`, { replace: true })
  }, [location.pathname, location.search, navigate])

  const handleAdminError = useCallback(
    (caughtError: unknown) => {
      if (
        caughtError instanceof ApiRequestError &&
        (caughtError.status === 401 || caughtError.code === 'ADMIN_FORBIDDEN')
      ) {
        redirectToLogin()
        return true
      }

      return false
    },
    [redirectToLogin]
  )

  const loadList = useCallback(async () => {
    if (!token) {
      redirectToLogin()
      return
    }

    setIsLoadingList(true)
    setListError(null)

    try {
      const response = await fetchAdminPreRegistrations(token, {
        accountStatus: filters.accountStatus || undefined,
        limit: 20,
        page,
        reviewStatus: filters.reviewStatus || undefined,
        role: filters.role || undefined,
        search: filters.search || undefined,
      })

      setList(response.data)
      setMeta(response.meta)
    } catch (caughtError) {
      if (handleAdminError(caughtError)) {
        return
      }

      setListError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Impossible de charger les pre-inscriptions.'
      )
    } finally {
      setIsLoadingList(false)
    }
  }, [filters, handleAdminError, page, redirectToLogin, token])

  const loadDetail = useCallback(
    async (id: number) => {
      if (!token) {
        redirectToLogin()
        return
      }

      setIsLoadingDetail(true)
      setDetailError(null)

      try {
        const response = await fetchAdminPreRegistrationById(token, id)
        setDetail(response)
      } catch (caughtError) {
        if (handleAdminError(caughtError)) {
          return
        }

        setDetailError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Impossible de charger le detail.'
        )
      } finally {
        setIsLoadingDetail(false)
      }
    },
    [handleAdminError, redirectToLogin, token]
  )

  useEffect(() => {
    void loadList()
  }, [loadList])

  useEffect(() => {
    if (!list.length) {
      setSelectedId(null)
      setDetail(null)
      return
    }

    if (!selectedId || !list.some((item) => item.id === selectedId)) {
      setSelectedId(list[0].id)
      return
    }

    void loadDetail(selectedId)
  }, [list, loadDetail, selectedId])

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setActionMessage(null)
  }

  const resetFilters = () => {
    setFilters({
      accountStatus: '',
      reviewStatus: '',
      role: '',
      search: '',
    })
    setPage(1)
    setActionMessage(null)
  }

  const approveSelected = async () => {
    if (!token || !selectedId) {
      return
    }

    setActionError(null)
    setActionMessage(null)
    setIsSubmittingAction(true)

    try {
      const response = await approveAdminPreRegistration(token, selectedId)
      setActionMessage(response.message ?? 'Pre-inscription approuvee.')
      await loadList()
      await loadDetail(selectedId)
    } catch (caughtError) {
      if (handleAdminError(caughtError)) {
        return
      }

      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Action impossible.'
      )
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const rejectSelected = async () => {
    if (!token || !selectedId) {
      return
    }

    const reason = rejectReason.trim()
    if (!reason) {
      setActionError('Le motif de refus est obligatoire.')
      return
    }

    setActionError(null)
    setActionMessage(null)
    setIsSubmittingAction(true)

    try {
      const response = await rejectAdminPreRegistration(
        token,
        selectedId,
        reason
      )
      setActionMessage(response.message ?? 'Pre-inscription refusee.')
      setRejectReason('')
      await loadList()
      await loadDetail(selectedId)
    } catch (caughtError) {
      if (handleAdminError(caughtError)) {
        return
      }

      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Action impossible.'
      )
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const maxPage = Math.max(1, Math.ceil(meta.total / meta.limit))

  return (
    <>
      <PageMeta
        description="Gestion admin des pre-inscriptions Upper Glam."
        title="Admin Pre-inscriptions"
      />

      <div className="space-y-5">
        <Card className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl">Gestion des pre-inscriptions</h2>
            <p className="text-sm text-[var(--ug-muted)]">
              Consultez, approuvez ou refusez les dossiers.
            </p>
          </div>

          <form className="grid gap-3 md:grid-cols-4" onSubmit={applyFilters}>
            <Input
              label="Recherche"
              name="search"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              placeholder="Email, nom, ville..."
              value={filters.search}
            />
            <Select
              label="Role"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  role: event.target.value as FiltersState['role'],
                }))
              }
              options={roleOptions}
              value={filters.role}
            />
            <Select
              label="Statut dossier"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  reviewStatus: event.target
                    .value as FiltersState['reviewStatus'],
                }))
              }
              options={reviewStatusOptions}
              value={filters.reviewStatus}
            />
            <Select
              label="Statut compte"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  accountStatus: event.target
                    .value as FiltersState['accountStatus'],
                }))
              }
              options={accountStatusOptions}
              value={filters.accountStatus}
            />
            <div className="flex flex-wrap gap-2 md:col-span-4">
              <Button size="md" type="submit" variant="primary">
                Appliquer
              </Button>
              <Button
                onClick={resetFilters}
                size="md"
                type="button"
                variant="secondary"
              >
                Reinitialiser
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--ug-muted)]">
                {meta.total} dossier(s) au total
              </p>
              <p className="text-sm text-[var(--ug-muted)]">
                Page {meta.page} / {maxPage}
              </p>
            </div>

            {listError && <p className="text-sm text-red-600">{listError}</p>}

            <div className="overflow-x-auto rounded-xl border border-[var(--ug-border)]">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-[var(--ug-surface)] text-[var(--ug-muted)]">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Candidat</th>
                    <th className="px-3 py-2">Ville</th>
                    <th className="px-3 py-2">Dossier</th>
                    <th className="px-3 py-2">Compte</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingList ? (
                    <tr>
                      <td
                        className="px-3 py-3 text-[var(--ug-muted)]"
                        colSpan={6}
                      >
                        Chargement...
                      </td>
                    </tr>
                  ) : list.length ? (
                    list.map((item) => (
                      <tr
                        className={
                          item.id === selectedId
                            ? 'cursor-pointer bg-[color:rgba(214,179,106,0.12)]'
                            : 'cursor-pointer hover:bg-[var(--ug-surface)]'
                        }
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td className="px-3 py-2">#{item.id}</td>
                        <td className="px-3 py-2">{item.role}</td>
                        <td className="px-3 py-2">
                          {item.applicant.firstName} {item.applicant.lastName}
                        </td>
                        <td className="px-3 py-2">{item.applicant.city}</td>
                        <td className="px-3 py-2">{item.review.status}</td>
                        <td className="px-3 py-2">{item.accountStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-3 py-3 text-[var(--ug-muted)]"
                        colSpan={6}
                      >
                        Aucun dossier.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2">
              <Button
                disabled={page <= 1 || isLoadingList}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                size="md"
                type="button"
                variant="secondary"
              >
                Precedent
              </Button>
              <Button
                disabled={page >= maxPage || isLoadingList}
                onClick={() =>
                  setPage((current) => Math.min(maxPage, current + 1))
                }
                size="md"
                type="button"
                variant="secondary"
              >
                Suivant
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xl">Detail du dossier</h3>

            {isLoadingDetail && (
              <p className="text-sm text-[var(--ug-muted)]">Chargement...</p>
            )}
            {detailError && (
              <p className="text-sm text-red-600">{detailError}</p>
            )}

            {!isLoadingDetail && !detail && (
              <p className="text-sm text-[var(--ug-muted)]">
                Selectionnez un dossier pour afficher son detail.
              </p>
            )}

            {detail && (
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge>{detail.role}</Badge>
                  <Badge>{detail.review.status}</Badge>
                  <Badge>{detail.accountStatus}</Badge>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <p>
                    <strong>Email:</strong> {detail.applicant.email}
                  </p>
                  <p>
                    <strong>Telephone:</strong> {detail.applicant.phone}
                  </p>
                  <p>
                    <strong>Prenom:</strong> {detail.applicant.firstName}
                  </p>
                  <p>
                    <strong>Nom:</strong> {detail.applicant.lastName}
                  </p>
                  <p>
                    <strong>Username:</strong>{' '}
                    {displayText(detail.applicant.username)}
                  </p>
                  <p>
                    <strong>Ville:</strong> {detail.applicant.city}{' '}
                    {detail.applicant.zipcode}
                  </p>
                  <p>
                    <strong>Cree le:</strong> {formatDate(detail.createdAt)}
                  </p>
                  <p>
                    <strong>Maj le:</strong> {formatDate(detail.updatedAt)}
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-[var(--ug-border)] p-3">
                  <h4 className="font-semibold">Marketing</h4>
                  <p>
                    <strong>Opt-in:</strong>{' '}
                    {detail.marketing.optIn ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Source:</strong>{' '}
                    {displayText(detail.marketing.source)}
                  </p>
                  <p>
                    <strong>Interest:</strong>{' '}
                    {displayText(detail.marketing.interest)}
                  </p>
                  <p>
                    <strong>Commentaire:</strong>{' '}
                    {displayText(detail.marketing.comment)}
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-[var(--ug-border)] p-3">
                  <h4 className="font-semibold">Preferences</h4>
                  <p>
                    <strong>Services:</strong>{' '}
                    {detail.preferences?.desiredServices?.join(', ') || '-'}
                  </p>
                  <p>
                    <strong>Modes:</strong>{' '}
                    {detail.preferences?.preferredServiceModes?.join(', ') ||
                      '-'}
                  </p>
                  <p>
                    <strong>Budget:</strong>{' '}
                    {formatCents(
                      detail.preferences?.preferredBudgetCents ?? null
                    )}
                  </p>
                </div>

                {detail.providerProfile && (
                  <div className="space-y-2 rounded-xl border border-[var(--ug-border)] p-3">
                    <h4 className="font-semibold">Profil prestataire</h4>
                    <p>
                      <strong>Display name:</strong>{' '}
                      {detail.providerProfile.displayName}
                    </p>
                    <p>
                      <strong>Business:</strong>{' '}
                      {displayText(detail.providerProfile.businessName)}
                    </p>
                    <p>
                      <strong>Modes:</strong>{' '}
                      {detail.providerProfile.serviceModes?.join(', ') || '-'}
                    </p>
                    <p>
                      <strong>Specialites:</strong>{' '}
                      {detail.providerProfile.specialties?.join(', ') || '-'}
                    </p>
                    <p>
                      <strong>Prix de depart:</strong>{' '}
                      {formatCents(detail.providerProfile.priceFromCents)}
                    </p>
                    <p>
                      <strong>Experience:</strong>{' '}
                      {detail.providerProfile.yearsExperience ?? '-'} ans
                    </p>
                    <p>
                      <strong>Certification:</strong>{' '}
                      {detail.providerProfile.hasCertification ? 'Oui' : 'Non'}
                    </p>
                    <p>
                      <strong>Adresse institut:</strong>{' '}
                      {displayText(detail.providerProfile.instituteAddress)}
                    </p>
                    <p>
                      <strong>Instagram:</strong>{' '}
                      {displayText(detail.providerProfile.instagramUrl)}
                    </p>
                    <p>
                      <strong>TikTok:</strong>{' '}
                      {displayText(detail.providerProfile.tiktokUrl)}
                    </p>
                  </div>
                )}

                <div className="space-y-2 rounded-xl border border-[var(--ug-border)] p-3">
                  <h4 className="font-semibold">Revue</h4>
                  <p>
                    <strong>Statut:</strong> {detail.review.status}
                  </p>
                  <p>
                    <strong>Revu le:</strong>{' '}
                    {formatDate(detail.review.reviewedAt)}
                  </p>
                  <p>
                    <strong>Par:</strong>{' '}
                    {displayText(detail.review.reviewedByEmail)}
                  </p>
                  <p>
                    <strong>Motif:</strong>{' '}
                    {displayText(detail.review.rejectionReason)}
                  </p>
                </div>

                <div className="space-y-3 rounded-xl border border-[var(--ug-border)] p-3">
                  <h4 className="font-semibold">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      disabled={
                        isSubmittingAction ||
                        detail.review.status === 'approved'
                      }
                      onClick={approveSelected}
                      size="md"
                      type="button"
                      variant="primary"
                    >
                      Approuver
                    </Button>
                  </div>

                  <Textarea
                    label="Motif de refus"
                    maxLength={1000}
                    name="rejectReason"
                    onChange={(event) => setRejectReason(event.target.value)}
                    placeholder="Dossier incomplet, merci de completer les informations."
                    value={rejectReason}
                  />
                  <Button
                    disabled={
                      isSubmittingAction || detail.review.status === 'rejected'
                    }
                    onClick={rejectSelected}
                    size="md"
                    type="button"
                    variant="secondary"
                  >
                    Refuser
                  </Button>
                </div>

                {actionMessage && (
                  <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700">
                    {actionMessage}
                  </p>
                )}
                {actionError && (
                  <p className="text-sm text-red-600">{actionError}</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
