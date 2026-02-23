import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import { App } from './app/App'
import { posthogOptions } from './lib/analytics'
import './styles/globals.css'

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {posthogKey ? (
      <PostHogProvider apiKey={posthogKey} options={posthogOptions}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>
)
