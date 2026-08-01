import { beforeAll, describe, expect, it } from 'vitest'
import { render } from '../entry-server'

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => undefined,
    },
  })
})

describe('SEO marketplace pre-rendering', () => {
  it('keeps empty acquisition hubs out of the index', () => {
    const result = render('/prestations')

    expect(result.html).toContain('Trouvez la prestation beauté')
    expect(result.seo.robots).toBe('noindex, follow')
    expect(result.seo.canonicalPath).toBe('/prestations')
  })

  it('renders the trust page as indexable initial HTML', () => {
    const result = render('/confiance')

    expect(result.html).toContain('Comment Upper Glam encadre')
    expect(result.seo.robots).toBe('index, follow')
    expect(result.seo.canonicalPath).toBe('/confiance')
  })

  it('keeps unknown provider profiles out of the index', () => {
    const result = render('/professionnels/profil-inconnu')

    expect(result.seo.robots).toBe('noindex, follow')
  })
})
