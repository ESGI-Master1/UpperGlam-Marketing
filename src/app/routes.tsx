import { Navigate, type RouteObject } from 'react-router-dom'
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
import {
  CitiesDirectoryPage,
  CityPage,
  LocalServicePage,
  ProviderProfilePage,
  ProvidersDirectoryPage,
  ServicePage,
  ServicesDirectoryPage,
  TrustPage,
} from '../pages/SeoMarketplace'
import { AdminLoginPage } from '../pages/admin/AdminLogin'
import { AdminPreRegistrationsPage } from '../pages/admin/AdminPreRegistrations'
import { AdminDashboardPage } from '../pages/admin/AdminDashboard'
import { AdminProvidersPage } from '../pages/admin/AdminProviders'
import { AdminUsersPage } from '../pages/admin/AdminUsers'

export const routes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/admin/tableau-de-bord" />,
      },
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <AdminRequireAuth />,
        children: [
          {
            path: 'tableau-de-bord',
            element: <AdminDashboardPage />,
          },
          {
            path: 'pre-inscriptions',
            element: <AdminPreRegistrationsPage />,
          },
          {
            path: 'utilisateurs',
            element: <AdminUsersPage />,
          },
          {
            path: 'prestataires',
            element: <AdminProvidersPage />,
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
      { path: 'prestations', element: <ServicesDirectoryPage /> },
      { path: 'prestations/:categorySlug', element: <ServicePage /> },
      { path: 'villes', element: <CitiesDirectoryPage /> },
      { path: 'villes/:citySlug', element: <CityPage /> },
      { path: 'professionnels', element: <ProvidersDirectoryPage /> },
      {
        path: 'professionnels/:providerSlug',
        element: <ProviderProfilePage />,
      },
      { path: 'confiance', element: <TrustPage /> },
      { path: ':citySlug/:categorySlug', element: <LocalServicePage /> },
      { path: 'pre-inscription', element: <PreSignupPage /> },
      {
        path: 'pre-inscription/client',
        element: <Navigate replace to="/pre-inscription?role=user" />,
      },
      {
        path: 'pre-inscription/pro',
        element: <Navigate replace to="/pre-inscription?role=provider" />,
      },
      { path: 'login', element: <LoginRedirectPage /> },
      { path: 'legal', element: <LegalPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'cgu', element: <CGUPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
