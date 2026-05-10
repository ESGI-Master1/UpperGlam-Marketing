import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RootApp } from './app/RootApp'
import './styles/globals.css'

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp posthogKey={posthogKey} />
  </StrictMode>
)
