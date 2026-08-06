import { Bell, ChevronDown, Gift, LogOut, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import './AppHeader.css'

const NAV_LINKS = [
  { label: 'Главная', path: '/' },
  { label: 'Платежи', path: '/payments' },
  { label: 'Сервисы', path: '/services' },
]

export default function AppHeader() {
  const location = useLocation()

  return (
    <header className="app-header">
      <div className="app-header__logo">
        <Link to="/" className="app-header__logo-text">
          точка
          <br />
          банк
        </Link>
      </div>

      <nav className="app-header__nav">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`app-header__nav-link${location.pathname === link.path ? ' app-header__nav-link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="app-header__right">
        <div className="app-header__user">
          <div className="app-header__avatar">НО</div>
          <span className="app-header__user-name">Носковец О.Н., ИП</span>
          <ChevronDown size={18} color="var(--color-primary)" />
        </div>

        <div className="app-header__actions">
          <button className="app-header__icon-btn" aria-label="Уведомления">
            <Bell size={24} />
            <span className="app-header__notification-dot" />
          </button>
          <button className="app-header__icon-btn" aria-label="Акции">
            <Gift size={24} />
          </button>
          <button className="app-header__icon-btn" aria-label="Настройки">
            <Settings size={24} />
          </button>
          <button className="app-header__icon-btn" aria-label="Выйти">
            <LogOut size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}
