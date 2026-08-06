import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AppHeader from '../components/AppHeader/AppHeader'
import StateToggle from '../components/ui/StateToggle'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <AppHeader />
      <Outlet />
      {/* Служебный переключатель прототипа — вне макета */}
      <StateToggle />
    </>
  )
}
