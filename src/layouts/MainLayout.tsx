import { Outlet } from 'react-router-dom'
import { CookieBanner } from '../components/common/CookieBanner'
import { PostHogPageView } from '../components/common/PostHogPageView'
import { PostHogEngagement } from '../components/common/PostHogEngagement'
import { Footer } from './Footer'
import { Header } from './Header'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ug-bg)] text-[var(--ug-text)]">
      <PostHogPageView />
      <PostHogEngagement />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
