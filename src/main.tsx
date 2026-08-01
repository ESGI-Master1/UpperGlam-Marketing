import { StrictMode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { RootApp } from './app/RootApp'
import { routes } from './app/routes'
import './styles/globals.css'

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const router = createBrowserRouter(routes)
const rootElement = document.getElementById('root')!
const app = (
  <StrictMode>
    <RootApp posthogKey={posthogKey} router={router} />
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
