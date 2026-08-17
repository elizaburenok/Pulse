import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  PlusCircle,
  FilePlus2,
  Clock,
  History,
  BadgePercent,
  PiggyBank,
  NotebookText,
  FileClock,
  Landmark,
  Signature,
  ShoppingBasket,
  Blocks,
  ReceiptText,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../context/RiskStateContext'
import { aggregateStatus, dueLabel, type PageStatus } from '../data/riskContent'
import { riskSummaryText, taskLogo, taskRows } from '../data/tasks'
import PulseFace from '../components/risks/PulseFace'
import mailLogo from '../logo/Mail.svg'
import taxDocumentLogo from '../logo/Tax Document.svg'
import taxReportsLogo from '../logo/Tax Reports.svg'
import './AccountingPage.css'

// Навигатор «Пульс»: собственные тексты статуса (заголовок — как везде,
// подзаголовок — из макета онлайн-бухгалтерии).
const PULSE_TEXT: Record<PageStatus, { title: string; subtitle: string }> = {
  ok: { title: 'Всё в порядке', subtitle: 'Налоги уплачены, отчётность сдана' },
  attention: {
    title: 'Обратите внимание',
    subtitle: 'Важно вовремя уплатить налоги и взносы',
  },
  overdue: {
    title: 'Серьёзно рискуете',
    subtitle: 'Уплатите налоги и взносы, чтобы избежать блокировки',
  },
}

const MENU = [
  'Документооборот',
  'Бухгалтерия с сотрудниками',
  'Заплатить по реквизитам',
  'Выставить счёт',
  'Перевести по номеру телефона',
]

interface GovItem {
  logo: string
  title: string
  desc: string
  badge?: string
}

const GOV: GovItem[] = [
  { logo: taxDocumentLogo, title: 'Требования', desc: 'Ознакомьтесь с требованием', badge: '1' },
  { logo: mailLogo, title: 'Письма', desc: 'Есть новые письма', badge: '3' },
  { logo: taxReportsLogo, title: 'Сверки', desc: '4 сверки готовятся' },
]

interface TileItem {
  icon: ReactNode
  title: string
  subtitle?: string
}

const SECTIONS: TileItem[] = [
  { icon: <History size={30} />, title: 'Операции' },
  { icon: <BadgePercent size={30} />, title: 'ЕНС', subtitle: 'Заявка принята' },
  { icon: <PiggyBank size={30} />, title: 'Копилка на налоги', subtitle: '0 ₽' },
  { icon: <NotebookText size={30} />, title: 'КУДиР' },
  { icon: <FileClock size={30} />, title: 'Обновления в документах' },
]

const PAGE_ACTIONS: TileItem[] = [
  { icon: <Landmark size={30} />, title: 'Налогообложение и патенты', subtitle: 'УСН «Доходы» — 6%' },
  { icon: <Signature size={30} />, title: 'Электронная подпись', subtitle: 'Действует до 01.08.2028' },
  { icon: <ShoppingBasket size={30} />, title: 'Маркетплейсы', subtitle: 'Wildberries, Ozon, Яндекс Маркет' },
  { icon: <Blocks size={30} />, title: 'Интеграции', subtitle: 'Т-Банк, Сбербанк' },
  { icon: <ReceiptText size={30} />, title: 'Тариф', subtitle: 'Всё включено' },
]

/**
 * Страница «Онлайн-бухгалтерия» — точка входа для клиентов со статусом
 * «Обратите внимание». Навигатор «Пульс» и список «Задачи» читают живой
 * статус из useRiskState, поэтому при закрытии задач страница бесшовно
 * показывает «Всё в порядке», не меняя точку входа.
 */
export default function AccountingPage() {
  const navigate = useNavigate()
  const { levels, openTasks, setEntryPath } = useRiskState()

  // Вход во флоу рисков из бухгалтерии — «Назад» на странице риска вернёт сюда.
  function openRisks() {
    setEntryPath('/accounting')
    navigate('/risks')
  }
  const status = aggregateStatus(levels)
  const pulse = PULSE_TEXT[status]
  // Подзаголовок навигатора называет, что нужно сделать (перечень задач).
  // В статусе «ok» задач нет — берём прежний статичный текст.
  const pulseSubtitle = riskSummaryText(openTasks, levels) ?? pulse.subtitle

  // Плоский список задач всех категорий, отсортированный по срочности.
  const rows = taskRows(openTasks, levels)

  return (
    <div className="acc-page">
      {/* Левая колонка-навигатор */}
      <aside className="acc-nav">
        <button className="acc-nav__back" onClick={() => navigate('/')} aria-label="Назад">
          <ArrowLeft size={20} />
        </button>
        <div className="acc-nav__head">
          <h1 className="acc-nav__title">Онлайн-бухгалтерия</h1>
          <p className="acc-nav__subtitle">УСН «Доходы» — 6%</p>
        </div>
        <nav className="acc-nav__menu">
          {MENU.map((label) => (
            <button key={label} className="acc-nav__link">
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Центральная колонка 720px + зарезервированная правая 280px */}
      <main className="acc-main">
        <div className="acc-col">
          {/* Кнопки-хедер */}
          <div className="acc-actions">
            <button className="acc-action-btn">
              <PlusCircle size={24} />
              Добавить операцию
            </button>
            <button className="acc-action-btn">
              <FilePlus2 size={24} />
              Добавить документ
            </button>
          </div>

          <div className="acc-stack">
            {/* Навигатор «Пульс бухгалтерии» → переход в риски */}
            <button
              className="acc-pulse"
              onClick={openRisks}
              aria-label="Открыть Пульс бухгалтерии"
            >
              <div className="acc-pulse__head">
                <span className="acc-pulse__title">Пульс бухгалтерии</span>
                <ChevronRight size={18} className="acc-chevron" />
              </div>
              <div className="acc-pulse__row">
                <PulseFace status={status} size={40} />
                <div className="acc-pulse__text">
                  <p className="acc-pulse__status">{pulse.title}</p>
                  <p className="acc-pulse__desc">{pulseSubtitle}</p>
                </div>
              </div>
            </button>

            {/* Навигатор «Задачи» */}
            <section className="acc-card">
              <button className="acc-card__head acc-card__head--link" onClick={openRisks}>
                <span className="acc-card__title">Задачи</span>
                <ChevronRight size={18} className="acc-chevron" />
              </button>
              <ul className="acc-list">
                {rows.map(({ task, severity }) => (
                  <li key={task.id} className="acc-list__item">
                    <img className="acc-list__logo" src={taskLogo(task)} alt="" aria-hidden="true" />
                    <div className="acc-list__text">
                      <p className="acc-list__title">{task.title}</p>
                      <p
                        className={
                          severity === 'overdue'
                            ? 'acc-list__due acc-list__due--overdue'
                            : 'acc-list__due'
                        }
                      >
                        {dueLabel(severity, task.date)}
                      </p>
                    </div>
                    {task.amount && <span className="acc-list__amount">{task.amount}</span>}
                  </li>
                ))}
              </ul>
              <button className="acc-card__more" onClick={openRisks}>
                Показать все
              </button>
            </section>

            {/* Навигатор «Общение с госорганами» */}
            <section className="acc-card">
              <div className="acc-card__head">
                <span className="acc-card__title">Общение с госорганами</span>
              </div>
              <ul className="acc-list">
                {GOV.map((item) => (
                  <li key={item.title} className="acc-list__item">
                    <img className="acc-list__logo" src={item.logo} alt="" aria-hidden="true" />
                    <div className="acc-list__text">
                      <p className="acc-list__title">{item.title}</p>
                      <p className="acc-list__due acc-list__due--muted">{item.desc}</p>
                    </div>
                    {item.badge ? (
                      <span className="acc-badge">{item.badge}</span>
                    ) : (
                      <Clock size={22} className="acc-list__clock" />
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Компактные карточки разделов */}
            <div className="acc-sections">
              {SECTIONS.map((card) => (
                <div key={card.title} className="acc-section-card">
                  <span className="acc-section-card__icon">{card.icon}</span>
                  <div className="acc-section-card__text">
                    <p className="acc-section-card__title">{card.title}</p>
                    {card.subtitle && <p className="acc-section-card__subtitle">{card.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Список действий */}
          <div className="acc-page-actions">
            {PAGE_ACTIONS.map((action) => (
              <div key={action.title} className="acc-page-action">
                <span className="acc-page-action__icon">{action.icon}</span>
                <div className="acc-page-action__text">
                  <p className="acc-page-action__title">{action.title}</p>
                  <p className="acc-page-action__subtitle">{action.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка — зарезервировано 280px */}
        <aside className="acc-right" aria-hidden="true" />
      </main>
    </div>
  )
}
