import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = path.join(rootDir, 'src', 'seo', 'catalog.generated.json')
const apiUrl = (
  process.env.SEO_API_URL ??
  process.env.VITE_PUBLIC_BACKEND_URL ??
  'http://localhost:3333'
).replace(/\/+$/, '')

function validateCatalog(catalog) {
  return (
    catalog &&
    Array.isArray(catalog.providers) &&
    Array.isArray(catalog.categories) &&
    Array.isArray(catalog.cities)
  )
}

function catalogContent(catalog) {
  return JSON.stringify({
    updatedAt: catalog.updatedAt,
    locationPageMinProviders: catalog.locationPageMinProviders,
    providers: catalog.providers,
    categories: catalog.categories,
    cities: catalog.cities,
  })
}

try {
  const response = await fetch(`${apiUrl}/seo/catalog`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const payload = await response.json()
  const catalog = payload?.data
  if (!validateCatalog(catalog)) {
    throw new Error('format de catalogue invalide')
  }
  const existing = JSON.parse(await readFile(outputPath, 'utf8'))
  if (
    existing.providers.length > 0 &&
    catalog.providers.length === 0 &&
    process.env.SEO_ALLOW_EMPTY_CATALOG !== '1'
  ) {
    throw new Error(
      'catalogue vide refusé pour protéger le dernier snapshot indexable'
    )
  }
  if (catalogContent(existing) === catalogContent(catalog)) {
    console.log(
      `Catalogue SEO inchangé : ${catalog.providers.length} professionnels réservables.`
    )
  } else {
    await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`)
    console.log(
      `Catalogue SEO actualisé : ${catalog.providers.length} professionnels réservables.`
    )
  }
} catch (error) {
  const existing = JSON.parse(await readFile(outputPath, 'utf8'))
  if (!validateCatalog(existing)) {
    throw error
  }
  console.warn(
    `Catalogue SEO indisponible sur ${apiUrl}; le dernier snapshot valide est conservé (${existing.providers.length} professionnels).`
  )
}
