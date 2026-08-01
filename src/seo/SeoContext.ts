import { createContext } from 'react'

export type JsonLd = Record<string, unknown>

export type SeoState = {
  canonicalPath?: string
  description?: string
  image?: string
  jsonLd?: JsonLd[]
  robots?: string
  title?: string
}

export type SeoCollector = (seo: SeoState) => void

export const SeoContext = createContext<SeoCollector | null>(null)
