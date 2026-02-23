import { useEffect } from 'react'

type PageMetaProps = {
  description: string
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

export function PageMeta({ description, title }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | Upper Glam`
    document.title = fullTitle
    setMetaTag('description', description)
    setMetaTag('og:title', fullTitle, 'property')
    setMetaTag('og:description', description, 'property')
  }, [description, title])

  return null
}
