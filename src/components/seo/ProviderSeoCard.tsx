import { Link } from 'react-router-dom'
import type { SeoProvider } from '../../seo/catalog'
import { Card } from '../ui/Card'

function formatPrice(cents: number | null, currency: string) {
  if (cents === null) return null
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function ProviderSeoCard({ provider }: { provider: SeoProvider }) {
  const price = formatPrice(provider.priceFromCents, provider.currency)
  return (
    <Card className="flex h-full flex-col gap-4">
      <div>
        <p className="text-sm text-[var(--ug-muted)]">{provider.city}</p>
        <h2 className="mt-1 text-2xl">{provider.name}</h2>
      </div>
      <p className="line-clamp-3 leading-relaxed text-[var(--ug-muted)]">
        {provider.bio}
      </p>
      <ul className="flex flex-wrap gap-2 text-sm" aria-label="Spécialités">
        {provider.services.slice(0, 4).map((service) => (
          <li
            className="rounded-full border border-[var(--ug-border)] px-3 py-1"
            key={`${provider.id}-${service.name}`}
          >
            {service.name}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
        <span>
          {price ? `À partir de ${price}` : 'Tarifs sur le profil'}
          {provider.reviewCount > 0
            ? ` · ${provider.rating.toFixed(1)}/5 (${provider.reviewCount} avis)`
            : ''}
        </span>
        <Link
          className="inline-flex min-h-11 items-center font-semibold text-[var(--ug-accent)]"
          to={`/professionnels/${provider.slug}`}
        >
          Voir les prestations
        </Link>
      </div>
    </Card>
  )
}
