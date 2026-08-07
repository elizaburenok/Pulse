import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import AccountingPage from './pages/AccountingPage'
import RisksPage from './pages/RisksPage'
import TaxPaymentPage from './pages/TaxPaymentPage'
import ContributionsPaymentPage from './pages/ContributionsPaymentPage'
import EnsNotificationPage from './pages/EnsNotificationPage'
import MarketplacesPage from './pages/MarketplacesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'accounting', element: <AccountingPage /> },
      { path: 'risks', element: <RisksPage /> },
      { path: 'risks/tax', element: <TaxPaymentPage /> },
      { path: 'risks/contributions', element: <ContributionsPaymentPage /> },
      { path: 'risks/ens', element: <EnsNotificationPage /> },
      { path: 'risks/marketplaces', element: <MarketplacesPage /> },
    ],
  },
])
