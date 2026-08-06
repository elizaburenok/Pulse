import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { RiskStateProvider } from './context/RiskStateContext'
// Design-system — единственный источник токенов и шрифта
import './design-system/tokens/css-variables.css'
import './design-system/fonts.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RiskStateProvider>
      <RouterProvider router={router} />
    </RiskStateProvider>
  </StrictMode>
)
