import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://upperglam.fr'
const SOCIAL_IMAGE = `${SITE_URL}/media/editorial/beauty-appointment.webp`

type PageMetaProps = {
  description: string
  noIndex?: boolean
  title: string
}

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

function setCanonicalLink(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  )
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = url
}

export function PageMeta({
  description,
  noIndex = false,
  title,
}: PageMetaProps) {
  const location = useLocation()

  useEffect(() => {
    const fullTitle = `${title} | Upper Glam`
    const canonicalUrl = `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`

    document.documentElement.lang = 'fr'
    document.title = fullTitle
    setCanonicalLink(canonicalUrl)
    setMetaTag('description', description)
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMetaTag('og:type', 'website', 'property')
    setMetaTag('og:site_name', 'Upper Glam', 'property')
    setMetaTag('og:locale', 'fr_FR', 'property')
    setMetaTag('og:title', fullTitle, 'property')
    setMetaTag('og:description', description, 'property')
    setMetaTag('og:url', canonicalUrl, 'property')
    setMetaTag('og:image', SOCIAL_IMAGE, 'property')
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', fullTitle)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', SOCIAL_IMAGE)

    let schema = document.head.querySelector<HTMLScriptElement>(
      'script[data-upperglam-schema]'
    )
    if (!schema) {
      schema = document.createElement('script')
      schema.type = 'application/ld+json'
      schema.dataset.upperglamSchema = 'true'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      applicationCategory: 'LifestyleApplication',
      description,
      name: 'Upper Glam',
      operatingSystem: 'Android, iOS, Web',
      url: canonicalUrl,
    })
  }, [description, location.pathname, noIndex, title])

  return null
}
