import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { ProviderSeoCard } from '../components/seo/ProviderSeoCard'
import { SeoBreadcrumbs } from '../components/seo/SeoBreadcrumbs'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'
import {
  providersForCategory,
  providersForCity,
  providersForLocation,
  seoCatalog,
  type SeoProvider,
} from '../seo/catalog'

const SITE_URL = 'https://upperglam.fr'

function formatPrice(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function ProviderGrid({ providers }: { providers: SeoProvider[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {providers.map((provider) => (
        <ProviderSeoCard key={provider.id} provider={provider} />
      ))}
    </div>
  )
}

function EmptyCatalog() {
  return (
    <Card className="space-y-4">
      <h2 className="text-2xl">L’offre publique arrive progressivement</h2>
      <p className="leading-relaxed text-[var(--ug-muted)]">
        Upper Glam ne publie pas de page locale vide. Les professionnels
        apparaissent ici seulement lorsque leurs prestations et leurs prochains
        créneaux sont disponibles.
      </p>
      <Link className={buttonClasses('primary')} to="/pre-inscription">
        Être informé du lancement
      </Link>
    </Card>
  )
}

export function ServicesDirectoryPage() {
  const hasOffer = seoCatalog.categories.length > 0
  return (
    <>
      <PageMeta
        description="Découvrez les prestations beauté réservables sur Upper Glam : coiffure, maquillage, onglerie, soins et services à domicile."
        noindex={!hasOffer}
        title="Prestations beauté disponibles"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[{ label: 'Accueil', to: '/' }, { label: 'Prestations' }]}
          />
          <Badge>Prestations beauté</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Trouvez la prestation beauté adaptée à votre besoin
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            Comparez les professionnels, les prix et les prochains créneaux.
            Seules les catégories disposant d’une offre réellement réservable
            sont publiées.
          </p>
        </div>
      </Section>
      <Section>
        {hasOffer ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {seoCatalog.categories.map((category) => (
              <Card className="space-y-3" key={category.slug}>
                <h2 className="text-2xl">{category.name}</h2>
                <p className="text-[var(--ug-muted)]">
                  {category.providerCount} professionnel
                  {category.providerCount > 1 ? 's' : ''} avec des créneaux
                  disponibles.
                </p>
                <Link
                  className="inline-flex min-h-11 items-center font-semibold text-[var(--ug-accent)]"
                  to={`/prestations/${category.slug}`}
                >
                  Comparer les offres de {category.name.toLowerCase()}
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyCatalog />
        )}
      </Section>
    </>
  )
}

export function ServicePage() {
  const { categorySlug = '' } = useParams()
  const category = seoCatalog.categories.find(
    (item) => item.slug === categorySlug
  )
  const providers = providersForCategory(categorySlug)
  const name = category?.name ?? 'Prestation beauté'
  const cities = seoCatalog.cities.filter((city) =>
    providers.some((provider) => provider.citySlug === city.slug)
  )
  return (
    <>
      <PageMeta
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Prestations', path: '/prestations' },
          { name, path: `/prestations/${categorySlug}` },
        ]}
        canonicalPath={`/prestations/${categorySlug}`}
        description={`Comparez les professionnels de ${name.toLowerCase()}, leurs tarifs et leurs disponibilités sur Upper Glam.`}
        noindex={!category || providers.length === 0}
        jsonLd={
          category
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Service',
                  name,
                  provider: { '@type': 'Organization', name: 'Upper Glam' },
                  areaServed: cities.map((city) => city.name),
                },
              ]
            : []
        }
        title={`${name} : prix et professionnels disponibles`}
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Prestations', to: '/prestations' },
              { label: name },
            ]}
          />
          <Badge>{name}</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Réserver une prestation de {name.toLowerCase()}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            Consultez les prestations détaillées, leur durée, leur prix et les
            prochains créneaux proposés par des professionnels actifs.
          </p>
        </div>
      </Section>
      <Section>
        {providers.length ? (
          <ProviderGrid providers={providers} />
        ) : (
          <EmptyCatalog />
        )}
      </Section>
      {cities.length ? (
        <Section>
          <h2 className="mb-5 text-3xl">
            Trouver {name.toLowerCase()} par ville
          </h2>
          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <Link
                className={buttonClasses('secondary')}
                key={city.slug}
                to={`/${city.slug}/${categorySlug}`}
              >
                {name} à {city.name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  )
}

export function CitiesDirectoryPage() {
  const eligibleCities = seoCatalog.cities.filter(
    (city) => city.providerCount >= seoCatalog.locationPageMinProviders
  )
  return (
    <>
      <PageMeta
        description="Trouvez les professionnels de la beauté et les prestations disponibles dans votre ville avec Upper Glam."
        noindex={eligibleCities.length === 0}
        title="Professionnels de la beauté par ville"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[{ label: 'Accueil', to: '/' }, { label: 'Villes' }]}
          />
          <Badge>Beauté locale</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Réserver un professionnel de beauté dans votre ville
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            Une ville est publiée uniquement lorsqu’elle réunit assez de
            professionnels actifs, de prestations détaillées et de créneaux
            réservables.
          </p>
        </div>
      </Section>
      <Section>
        {eligibleCities.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {eligibleCities.map((city) => (
              <Card className="space-y-3" key={city.slug}>
                <h2 className="text-2xl">{city.name}</h2>
                <p className="text-[var(--ug-muted)]">
                  {city.providerCount} professionnels réservables
                </p>
                <Link
                  className="inline-flex min-h-11 items-center font-semibold text-[var(--ug-accent)]"
                  to={`/villes/${city.slug}`}
                >
                  Voir les professionnels à {city.name}
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyCatalog />
        )}
      </Section>
    </>
  )
}

export function CityPage() {
  const { citySlug = '' } = useParams()
  const city = seoCatalog.cities.find((item) => item.slug === citySlug)
  const providers = providersForCity(citySlug)
  const eligible = providers.length >= seoCatalog.locationPageMinProviders
  const name = city?.name ?? 'Votre ville'
  const categories = seoCatalog.categories.filter((category) =>
    providers.some((provider) =>
      provider.services.some(
        (service) => service.categorySlug === category.slug
      )
    )
  )
  return (
    <>
      <PageMeta
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Villes', path: '/villes' },
          { name, path: `/villes/${citySlug}` },
        ]}
        canonicalPath={`/villes/${citySlug}`}
        description={`Comparez les professionnels de beauté à ${name}, leurs prestations, prix, avis et disponibilités.`}
        noindex={!city || !eligible}
        title={`Professionnels de beauté à ${name}`}
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Villes', to: '/villes' },
              { label: name },
            ]}
          />
          <Badge>{name}</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Réserver une prestation beauté à {name}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            Découvrez des professionnels actifs à {name}, leurs tarifs et leurs
            prochains créneaux, en institut ou à domicile selon les profils.
          </p>
        </div>
      </Section>
      <Section>
        {providers.length ? (
          <ProviderGrid providers={providers} />
        ) : (
          <EmptyCatalog />
        )}
      </Section>
      {categories.length ? (
        <Section>
          <h2 className="mb-5 text-3xl">Prestations disponibles à {name}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                className={buttonClasses('secondary')}
                key={category.slug}
                to={`/${citySlug}/${category.slug}`}
              >
                {category.name} à {name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  )
}

export function LocalServicePage() {
  const { citySlug = '', categorySlug = '' } = useParams()
  const city = seoCatalog.cities.find((item) => item.slug === citySlug)
  const category = seoCatalog.categories.find(
    (item) => item.slug === categorySlug
  )
  const providers = providersForLocation(categorySlug, citySlug)
  const eligible = providers.length >= seoCatalog.locationPageMinProviders
  const cityName = city?.name ?? 'votre ville'
  const categoryName = category?.name ?? 'prestation beauté'
  const prices = providers.flatMap((provider) =>
    provider.services
      .filter((service) => service.categorySlug === categorySlug)
      .map((service) => service.priceCents)
  )
  const priceText = prices.length
    ? `Les prix observés vont de ${formatPrice(Math.min(...prices))} à ${formatPrice(Math.max(...prices))}.`
    : ''
  return (
    <>
      <PageMeta
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: categoryName, path: `/prestations/${categorySlug}` },
          { name: cityName, path: `/${citySlug}/${categorySlug}` },
        ]}
        canonicalPath={`/${citySlug}/${categorySlug}`}
        description={`${categoryName} à ${cityName} : comparez les prix, les professionnels, les avis et les disponibilités réelles.`}
        noindex={!city || !category || !eligible}
        jsonLd={
          eligible
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Service',
                  name: `${categoryName} à ${cityName}`,
                  areaServed: { '@type': 'City', name: cityName },
                  offers: {
                    '@type': 'AggregateOffer',
                    lowPrice: Math.min(...prices) / 100,
                    highPrice: Math.max(...prices) / 100,
                    priceCurrency: 'EUR',
                    offerCount: prices.length,
                  },
                },
              ]
            : []
        }
        title={`${categoryName} à ${cityName} : prix et disponibilités`}
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: categoryName, to: `/prestations/${categorySlug}` },
              { label: cityName },
            ]}
          />
          <Badge>
            {categoryName} · {cityName}
          </Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Réserver {categoryName.toLowerCase()} à {cityName}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            Comparez une offre locale réellement disponible. {priceText} Les
            horaires et modalités exactes figurent sur chaque profil.
          </p>
        </div>
      </Section>
      <Section>
        {providers.length ? (
          <ProviderGrid providers={providers} />
        ) : (
          <EmptyCatalog />
        )}
      </Section>
    </>
  )
}

export function ProvidersDirectoryPage() {
  return (
    <>
      <PageMeta
        description="Découvrez les professionnels de la beauté réservables sur Upper Glam, leurs spécialités, tarifs, avis et disponibilités."
        noindex={seoCatalog.providers.length === 0}
        title="Professionnels de la beauté disponibles"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[{ label: 'Accueil', to: '/' }, { label: 'Professionnels' }]}
          />
          <Badge>Professionnels</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Professionnels de la beauté avec des créneaux disponibles
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            Chaque profil public présente une activité réelle, des prestations
            actives et au moins un prochain créneau réservable.
          </p>
        </div>
      </Section>
      <Section>
        {seoCatalog.providers.length ? (
          <ProviderGrid providers={seoCatalog.providers} />
        ) : (
          <EmptyCatalog />
        )}
      </Section>
    </>
  )
}

export function ProviderProfilePage() {
  const { providerSlug = '' } = useParams()
  const provider = seoCatalog.providers.find(
    (item) => item.slug === providerSlug
  )
  if (!provider) {
    return (
      <>
        <PageMeta
          description="Ce profil professionnel n’est pas disponible."
          noindex
          title="Profil indisponible"
        />
        <Section>
          <EmptyCatalog />
        </Section>
      </>
    )
  }
  const canonicalPath = `/professionnels/${provider.slug}`
  const schemaType = provider.instituteAddress ? 'LocalBusiness' : 'Person'
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: provider.name,
    description: provider.bio,
    url: `${SITE_URL}${canonicalPath}`,
    areaServed: [provider.city, ...provider.homeServiceZones],
    makesOffer: provider.services.map((service) => ({
      '@type': 'Offer',
      price: service.priceCents / 100,
      priceCurrency: provider.currency,
      itemOffered: { '@type': 'Service', name: service.name },
    })),
  }
  if (provider.instituteAddress) {
    structuredData.address = provider.instituteAddress
  }
  if (provider.reviewCount > 0) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: provider.rating,
      reviewCount: provider.reviewCount,
    }
  }
  return (
    <>
      <PageMeta
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Professionnels', path: '/professionnels' },
          { name: provider.name, path: canonicalPath },
        ]}
        canonicalPath={canonicalPath}
        description={`${provider.name}, professionnel de la beauté à ${provider.city} : prestations, prix, avis et disponibilités.`}
        jsonLd={[structuredData]}
        title={`${provider.name}, professionnel de beauté à ${provider.city}`}
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Professionnels', to: '/professionnels' },
              { label: provider.name },
            ]}
          />
          <Badge>{provider.city}</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            {provider.name}, professionnel de beauté à {provider.city}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            {provider.bio}
          </p>
          {provider.reviewCount > 0 ? (
            <p className="font-semibold">
              {provider.rating.toFixed(1)}/5 · {provider.reviewCount} avis issus
              de réservations
            </p>
          ) : null}
        </div>
      </Section>
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h2 className="text-3xl">Prestations et tarifs</h2>
            {provider.services.map((service) => (
              <Card
                className="flex flex-wrap items-center justify-between gap-3"
                key={service.name}
              >
                <div>
                  <h3 className="text-xl">{service.name}</h3>
                  <p className="text-sm text-[var(--ug-muted)]">
                    {service.durationMinutes} minutes · {service.category}
                  </p>
                </div>
                <strong>
                  {formatPrice(service.priceCents, provider.currency)}
                </strong>
              </Card>
            ))}
          </div>
          <Card className="h-fit space-y-4">
            <h2 className="text-2xl">Disponibilité et zone</h2>
            <p className="text-[var(--ug-muted)]">
              {provider.serviceModes.includes('home')
                ? 'Déplacement à domicile disponible. '
                : ''}
              {provider.serviceModes.includes('institute')
                ? 'Rendez-vous en institut disponible.'
                : ''}
            </p>
            {provider.homeServiceZones.length ? (
              <p>Zones desservies : {provider.homeServiceZones.join(', ')}</p>
            ) : null}
            {provider.instituteAddress ? (
              <p>Adresse professionnelle : {provider.instituteAddress}</p>
            ) : null}
            {provider.nextSlots.length ? (
              <>
                <h3 className="font-semibold">Prochains créneaux</h3>
                <ul className="list-disc space-y-2 pl-5">
                  {provider.nextSlots.map((slot) => (
                    <li key={slot}>
                      {new Intl.DateTimeFormat('fr-FR', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      }).format(new Date(slot))}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <Link
              className={buttonClasses('primary', 'lg', 'w-full')}
              to="/pre-inscription"
            >
              Réserver avec Upper Glam
            </Link>
          </Card>
        </div>
      </Section>
    </>
  )
}

export function TrustPage() {
  return (
    <>
      <PageMeta
        description="Découvrez comment Upper Glam contrôle les profils, protège les comptes et encadre les avis et réservations."
        title="Confiance, vérification et sécurité"
      />
      <Section className="pt-14 sm:pt-20">
        <div className="space-y-6">
          <SeoBreadcrumbs
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Confiance et sécurité' },
            ]}
          />
          <Badge>Confiance</Badge>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            Comment Upper Glam encadre les profils et les réservations
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--ug-muted)]">
            La plateforme distingue clairement les contrôles déjà réalisés des
            justificatifs qui pourront être affichés sur chaque profil.
          </p>
        </div>
      </Section>
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            [
              'Contrôle avant activation',
              'Les informations de pré-inscription sont examinées dans le back-office. Un compte professionnel n’est activé qu’après décision explicite de l’équipe.',
            ],
            [
              'Informations publiques',
              'Le nom professionnel, la ville, les prestations, les tarifs et les modalités de rendez-vous sont présentés sans exposer les espaces privés du compte.',
            ],
            [
              'Avis liés aux réservations',
              'Le modèle de données relie chaque avis à une réservation et contrôle une note comprise entre 1 et 5. Aucun avis n’est inventé pour enrichir une page.',
            ],
            [
              'Paiement et sécurité',
              'Les paiements sont confiés à un prestataire spécialisé. Les accès administrateurs sont authentifiés, autorisés et journalisés.',
            ],
            [
              'Disponibilités réelles',
              'Une page professionnelle n’entre dans le catalogue SEO que si elle possède une prestation active et un créneau futur non réservé.',
            ],
            [
              'Signalement et assistance',
              'Toute question sur un profil, une donnée ou un contenu peut être adressée à l’équipe depuis la page Contact.',
            ],
          ].map(([title, body]) => (
            <Card className="space-y-3" key={title}>
              <h2 className="text-2xl">{title}</h2>
              <p className="leading-relaxed text-[var(--ug-muted)]">{body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
