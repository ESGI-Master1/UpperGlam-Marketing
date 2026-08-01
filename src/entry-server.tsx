import { renderToString } from 'react-dom/server'
import { createMemoryRouter } from 'react-router-dom'
import { RootApp } from './app/RootApp'
import { routes } from './app/routes'
import { SeoContext, type SeoState } from './seo/SeoContext'

export function render(url: string) {
  const seo: SeoState = {}
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  const html = renderToString(
    <SeoContext.Provider value={(nextSeo) => Object.assign(seo, nextSeo)}>
      <RootApp router={router} />
    </SeoContext.Provider>
  )

  return { html, seo }
}
