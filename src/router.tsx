import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import RisksPage from './pages/RisksPage'
import TaxPaymentPage from './pages/TaxPaymentPage'
import EnsNotificationPage from './pages/EnsNotificationPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'risks', element: <RisksPage /> },
      { path: 'risks/tax', element: <TaxPaymentPage /> },
      { path: 'risks/ens', element: <EnsNotificationPage /> },
    ],
  },
])
