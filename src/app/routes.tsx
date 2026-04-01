import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminRequireAuth } from '../components/admin/AdminRequireAuth'
import { AdminLayout } from '../layouts/AdminLayout'
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
import { PreSignupPage } from '../pages/PreSignup'
import { ProPage } from '../pages/Pro'
import { AdminLoginPage } from '../pages/admin/AdminLogin'
import { AdminPreRegistrationsPage } from '../pages/admin/AdminPreRegistrations'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/admin/pre-inscriptions" />,
      },
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <AdminRequireAuth />,
        children: [
          {
            path: 'pre-inscriptions',
            element: <AdminPreRegistrationsPage />,
          },
        ],
      },
      { path: '*', element: <Navigate replace to="/admin/login" /> },
    ],
  },
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
      { path: 'pre-inscription', element: <PreSignupPage /> },
      {
        path: 'pre-inscription/client',
        element: <Navigate replace to="/pre-inscription" />,
      },
      {
        path: 'pre-inscription/pro',
        element: <Navigate replace to="/pre-inscription" />,
      },
      { path: 'login', element: <LoginRedirectPage /> },
      { path: 'legal', element: <LegalPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'cgu', element: <CGUPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
