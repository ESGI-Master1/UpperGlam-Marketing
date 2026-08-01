import { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { SeoContext, type JsonLd } from '../../seo/SeoContext'

type PageMetaProps = {
  breadcrumbs?: Array<{ name: string; path: string }>
  canonicalPath?: string
  description: string
  image?: string
  jsonLd?: JsonLd[]
  noIndex?: boolean
  noindex?: boolean
  title: string
}

const SITE_URL = 'https://upperglam.fr'

function setMetaTag(
  name: string,
  content: string,
  attr: 'name' | 'property' = 'name'
) {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLinkTag(rel: string, href: string) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

export function PageMeta({
  breadcrumbs,
  canonicalPath,
  description,
  image = '/media/editorial/beauty-appointment.webp',
  jsonLd = [],
  noIndex = false,
  noindex = false,
  title,
}: PageMetaProps) {
  const location = useLocation()
  const collectSeo = useContext(SeoContext)
  const path = canonicalPath ?? location.pathname
  const canonical = new URL(path, SITE_URL).toString()
  const fullTitle = title.includes('Upper Glam')
    ? title
    : `${title} | Upper Glam`
  const robots = noIndex || noindex ? 'noindex, follow' : 'index, follow'
  const effectiveJsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description,
        inLanguage: 'fr-FR',
        name: fullTitle,
        url: canonical,
      },
      ...(path === '/'
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'contact.upperglam@gmail.com',
              },
              logo: `${SITE_URL}/logo.png`,
              name: 'Upper Glam',
              sameAs: ['https://instagram.com/upper_glam'],
              url: SITE_URL,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              inLanguage: 'fr-FR',
              name: 'Upper Glam',
              publisher: { '@type': 'Organization', name: 'Upper Glam' },
              url: SITE_URL,
            },
          ]
        : [
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: (
                breadcrumbs ?? [
                  { name: 'Accueil', path: '/' },
                  { name: title, path },
                ]
              ).map((item, index) => ({
                '@type': 'ListItem',
                item: new URL(item.path, SITE_URL).toString(),
                name: item.name,
                position: index + 1,
              })),
            },
          ]),
      ...jsonLd,
    ],
    [breadcrumbs, canonical, description, fullTitle, jsonLd, path, title]
  )

  collectSeo?.({
    canonicalPath: path,
    description,
    image,
    jsonLd: effectiveJsonLd,
    robots,
    title: fullTitle,
  })

  useEffect(() => {
    document.title = fullTitle
    setMetaTag('description', description)
    setMetaTag('robots', robots)
    setMetaTag('og:title', fullTitle, 'property')
    setMetaTag('og:description', description, 'property')
    setMetaTag('og:type', 'website', 'property')
    setMetaTag('og:url', canonical, 'property')
    setMetaTag('og:image', new URL(image, SITE_URL).toString(), 'property')
    setMetaTag('twitter:card', 'summary_large_image')
    setLinkTag('canonical', canonical)

    document.head
      .querySelectorAll('script[data-upperglam-json-ld]')
      .forEach((node) => node.remove())
    effectiveJsonLd.forEach((data) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.upperglamJsonLd = ''
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    })
  }, [canonical, description, effectiveJsonLd, fullTitle, image, robots])

  return null
}
