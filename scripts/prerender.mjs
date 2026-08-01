import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const serverDir = path.join(rootDir, 'dist-ssr')
const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
const { render } = await import(
  `${pathToFileURL(path.join(serverDir, 'entry-server.js')).href}?v=${Date.now()}`
)
const catalog = JSON.parse(
  await readFile(
    path.join(rootDir, 'src', 'seo', 'catalog.generated.json'),
    'utf8'
  )
)

const coreRoutes = [
  '/',
  '/client',
  '/pro',
  '/how-it-works',
  '/about',
  '/faq',
  '/contact',
  '/confiance',
  '/pre-inscription',
  '/legal',
  '/privacy',
  '/cgu',
]
const eligibleCities = catalog.cities.filter(
  (city) => city.providerCount >= catalog.locationPageMinProviders
)
const marketRoutes = [
  '/prestations',
  '/villes',
  '/professionnels',
  ...catalog.categories.map((category) => `/prestations/${category.slug}`),
  ...eligibleCities.map((city) => `/villes/${city.slug}`),
  ...catalog.providers.map((provider) => `/professionnels/${provider.slug}`),
  ...eligibleCities.flatMap((city) =>
    catalog.categories
      .filter(
        (category) =>
          catalog.providers.filter(
            (provider) =>
              provider.citySlug === city.slug &&
              provider.services.some(
                (service) => service.categorySlug === category.slug
              )
          ).length >= catalog.locationPageMinProviders
      )
      .map((category) => `/${city.slug}/${category.slug}`)
  ),
]
const publicRoutes = [...new Set([...coreRoutes, ...marketRoutes])]

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderHead(seo) {
  const canonical = new URL(seo.canonicalPath ?? '/', 'https://upperglam.fr')
  const image = new URL(seo.image ?? '/logo.png', 'https://upperglam.fr')
  const jsonLd = (seo.jsonLd ?? [])
    .map(
      (value) =>
        `<script type="application/ld+json" data-upperglam-json-ld>${JSON.stringify(value).replaceAll('<', '\\u003c')}</script>`
    )
    .join('\n    ')

  return [
    `<title>${escapeHtml(seo.title ?? 'Upper Glam')}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots ?? 'index, follow')}" />`,
    `<link rel="canonical" href="${canonical.href}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${escapeHtml(seo.title ?? 'Upper Glam')}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${canonical.href}" />`,
    `<meta property="og:image" content="${image.href}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    jsonLd,
  ]
    .filter(Boolean)
    .join('\n    ')
}

function composePage(url) {
  const { html, seo } = render(url)
  return template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*\/>/g, '')
    .replace(
      /\s*<meta\s+(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[\s\S]*?\/>/g,
      ''
    )
    .replace('</head>', `    ${renderHead(seo)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

for (const url of publicRoutes) {
  const outputDir = url === '/' ? distDir : path.join(distDir, url.slice(1))
  await mkdir(outputDir, { recursive: true })
  await writeFile(path.join(outputDir, 'index.html'), composePage(url))
}

const sitemapRoutes = publicRoutes.filter(
  (url) =>
    !['/pre-inscription', '/legal', '/privacy', '/cgu'].includes(url) &&
    (catalog.providers.length > 0 ||
      !['/prestations', '/villes', '/professionnels'].includes(url))
)
const xmlEscape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((url) => {
    const provider = catalog.providers.find(
      (item) => `/professionnels/${item.slug}` === url
    )
    const lastmod =
      provider?.updatedAt ??
      (url.startsWith('/prestations/') || url.startsWith('/villes/')
        ? catalog.updatedAt
        : null)
    return `  <url><loc>${xmlEscape(new URL(url, 'https://upperglam.fr').href)}</loc>${lastmod ? `<lastmod>${String(lastmod).slice(0, 10)}</lastmod>` : ''}</url>`
  })
  .join('\n')}
</urlset>
`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)

await writeFile(
  path.join(distDir, '404.html'),
  composePage('/page-introuvable')
)
await rm(serverDir, { recursive: true, force: true })

console.log(
  `Pre-rendered ${publicRoutes.length} public routes (${catalog.providers.length} professional profiles) and 404.html`
)
