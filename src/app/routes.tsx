import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { AudienceLayout } from '../layouts/AudienceLayout'
import { AboutPage } from '../pages/About'
import { CGUPage } from '../pages/CGU'
import { ClientPage } from '../pages/Client'
import { ContactPage } from '../pages/Contact'
import { FAQPage } from '../pages/FAQ'
import { Home } from '../pages/Home'
import { HowItWorksPage } from '../pages/HowItWorks'
import { LegalPage } from '../pages/Legal'
import { LoginRedirectPage } from '../pages/LoginRedirect'
import { NotFoundPage } from '../pages/NotFound'
import { PrivacyPage } from '../pages/Privacy'
import { PreSignupClientPage } from '../pages/PreSignupClient'
import { PreSignupProPage } from '../pages/PreSignupPro'
import { ProPage } from '../pages/Pro'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      {
        element: <AudienceLayout />,
        children: [
          { path: 'client', element: <ClientPage /> },
          { path: 'pro', element: <ProPage /> },
        ],
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'pre-inscription/client', element: <PreSignupClientPage /> },
      { path: 'pre-inscription/pro', element: <PreSignupProPage /> },
      { path: 'login', element: <LoginRedirectPage /> },
      { path: 'legal', element: <LegalPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'cgu', element: <CGUPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
