import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const catalog = JSON.parse(
  await readFile(
    path.join(rootDir, 'src', 'seo', 'catalog.generated.json'),
    'utf8'
  )
)
const eligibleCities = catalog.cities.filter(
  (city) => city.providerCount >= catalog.locationPageMinProviders
)
const routes = [
  '/',
  '/client',
  '/pro',
  '/how-it-works',
  '/about',
  '/faq',
  '/contact',
  '/confiance',
  '/prestations',
  '/villes',
  '/professionnels',
  '/pre-inscription',
  '/legal',
  '/privacy',
  '/cgu',
  ...catalog.categories.map((category) => `/prestations/${category.slug}`),
  ...eligibleCities.map((city) => `/villes/${city.slug}`),
  ...catalog.providers.map((provider) => `/professionnels/${provider.slug}`),
]
const errors = []

function fail(route, message) {
  errors.push(`${route}: ${message}`)
}

await access(path.join(distDir, 'index.html')).catch(() => {
  throw new Error('Le dossier dist est absent. Exécutez npm run build.')
})

for (const route of routes) {
  const file =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.slice(1), 'index.html')
  const source = await readFile(file, 'utf8')
  const dom = new JSDOM(source)
  const { document } = dom.window
  const root = document.querySelector('#root')
  const title = document.querySelector('title')?.textContent.trim() ?? ''
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute('content')
  const canonical = document
    .querySelector('link[rel="canonical"]')
    ?.getAttribute('href')
  const h1s = document.querySelectorAll('h1')
  const robots = document
    .querySelector('meta[name="robots"]')
    ?.getAttribute('content')
  const jsonLd = [
    ...document.querySelectorAll('script[type="application/ld+json"]'),
  ]

  if (!root || (root.textContent?.trim().length ?? 0) < 100)
    fail(route, 'contenu HTML initial absent ou trop court')
  if (!title || title.length > 65)
    fail(route, `title absent ou trop long (${title.length})`)
  if (!description || description.length < 70 || description.length > 170)
    fail(route, 'meta description absente ou hors plage 70–170 caractères')
  if (canonical !== new URL(route, 'https://upperglam.fr').href)
    fail(route, `canonical incorrecte (${canonical ?? 'absente'})`)
  if (h1s.length !== 1) fail(route, `${h1s.length} balise(s) H1`)
  if (
    catalog.providers.length === 0 &&
    ['/prestations', '/villes', '/professionnels'].includes(route) &&
    robots !== 'noindex, follow'
  )
    fail(route, 'catalogue vide sans noindex')
  if (source.match(/\[PLACEHOLDER|Contenu placeholder|\[Numero|\[Adresse/iu))
    fail(route, 'placeholder public détecté')
  if (jsonLd.length === 0) fail(route, 'JSON-LD absent')

  for (const script of jsonLd) {
    try {
      JSON.parse(script.textContent ?? '')
    } catch {
      fail(route, 'JSON-LD invalide')
    }
  }
}

const notFound = await readFile(path.join(distDir, '404.html'), 'utf8')
if (!notFound.includes('noindex, follow')) fail('/404.html', 'noindex absent')

for (const asset of ['robots.txt', 'llms.txt', 'sitemap.xml']) {
  await access(path.join(distDir, asset)).catch(() =>
    fail(`/${asset}`, 'fichier absent')
  )
}

if (errors.length) {
  console.error(
    `Audit SEO statique : ${errors.length} erreur(s)\n- ${errors.join('\n- ')}`
  )
  process.exitCode = 1
} else {
  console.log(
    `Audit SEO statique réussi : ${routes.length} pages, ${catalog.providers.length} profils + 404 + fichiers robots/llms/sitemap`
  )
}
