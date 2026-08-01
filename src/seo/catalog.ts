import rawCatalog from './catalog.generated.json'

export type SeoService = {
  name: string
  category: string
  categorySlug: string
  durationMinutes: number
  priceCents: number
}

export type SeoProvider = {
  id: number
  slug: string
  name: string
  city: string
  citySlug: string
  bio: string
  instituteAddress: string | null
  serviceModes: string[]
  homeServiceZones: string[]
  priceFromCents: number | null
  currency: string
  rating: number
  reviewCount: number
  updatedAt: string
  services: SeoService[]
  tags: Array<{ slug: string; label: string }>
  nextSlots: string[]
}

export type SeoCatalog = {
  generatedAt: string | null
  updatedAt: string | null
  locationPageMinProviders: number
  providers: SeoProvider[]
  categories: Array<{ slug: string; name: string; providerCount: number }>
  cities: Array<{ slug: string; name: string; providerCount: number }>
}

export const seoCatalog = rawCatalog as SeoCatalog

export function providersForCategory(categorySlug: string) {
  return seoCatalog.providers.filter((provider) =>
    provider.services.some((service) => service.categorySlug === categorySlug)
  )
}

export function providersForCity(citySlug: string) {
  return seoCatalog.providers.filter(
    (provider) => provider.citySlug === citySlug
  )
}

export function providersForLocation(categorySlug: string, citySlug: string) {
  return providersForCategory(categorySlug).filter(
    (provider) => provider.citySlug === citySlug
  )
}
