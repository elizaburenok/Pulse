import { Search, ChevronsLeft, FileText, Building2, Tag, Key, Camera, MoreHorizontal, Plus, SlidersHorizontal, ChevronRight, ChevronDown, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../context/RiskStateContext'
import { aggregateStatus, dueLabel } from '../data/riskContent'
import { riskyTaskRows } from '../data/tasks'
import RiskRightColumn from '../components/home/RiskRightColumn'
import TaskStack, { type HomeTaskItem } from '../components/home/TaskStack'
import './HomePage.css'

// Задачи других сервисов банка — независимы от риска бухгалтерии, показаны
// для демонстрации стека при >3 задачах (Bank-Patterns, node 82343-57751).
// Не кликабельны — заглушки, у прототипа нет их страниц выполнения.
const OTHER_SERVICE_TASKS: HomeTaskItem[] = [
  {
    id: 'compliance-request',
    label: 'Комплаенс',
    title: 'Ответьте на запрос, чтобы избежать ограничений',
    due: 'До 29 ноября не позднее 23:59',
    severity: 'overdue',
  },
  {
    id: 'acquiring-docs',
    label: 'Эквайринг',
    title: 'Загрузите документы',
    due: 'Нужно загрузить подписанные документы',
    severity: 'attention',
  },
]

const QUICK_ACTIONS = [
  { icon: <FileText size={20} />, label: 'Скачать выписку' },
  { icon: <Building2 size={20} />, label: 'Посмотреть реквизиты' },
  { icon: <Tag size={20} />, label: 'Посмотреть тариф и лимиты' },
  { icon: <Key size={20} />, label: 'Предоставить доступ' },
  { icon: <Camera size={20} />, label: 'Заплатить по фото или документу' },
]

const SERVICES = [
  { label: 'Зарплатный проект', color: '#82bebe' },
  { label: 'Депозиты', color: '#91c089' },
  { label: 'Эквайринг и онлайн‑кассы', color: '#82bad4' },
  { label: 'Валютные операции', color: '#a8a3f1' },
  { label: 'Контрагенты', color: '#82bebe' },
]

const ACCOUNTS = [
  { type: 'Расчётный', amount: '23 422 785,37 ₽', mask: '*3486' },
  { type: 'Личный', amount: '422 785,37 ₽', mask: '*3486' },
]

const TRANSACTIONS = [
  {
    amount: '– 250 000 ₽',
    status: 'Исполнено',
    counterparty: 'Лаванда, ООО',
    description: 'Оплата лицензионного вознаграждения за использование базовой лицензии за период с 01.11.22 по 30.11.22. НДС не предусмотрен.',
    ref: '№6884, 13:40',
  },
  {
    amount: '– 2 000 ₽',
    status: 'Исполнено',
    counterparty: 'Дмитрий Олегович С.',
    description: 'Перевод средств',
    ref: '№6883, 12:15',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { openTasks, levels, setEntryPath } = useRiskState()

  // Задачи-риски бухгалтерии (категория не «ok»), отсортированные по
  // приоритету. В статусе «Всё в порядке» их нет.
  const riskyRows = riskyTaskRows(openTasks, levels)

  // Клик по задаче бухгалтерии — вход во флоу рисков (страница выполнения),
  // «Назад» вернёт на главную.
  function openAccountingTask(taskId: string, target: 'tax' | 'contributions' | 'ens' | null) {
    setEntryPath('/')
    const state = { taskId }
    if (target === 'tax') navigate('/risks/tax', { state })
    else if (target === 'contributions') navigate('/risks/contributions', { state })
    else if (target === 'ens') navigate('/risks/ens', { state })
    else navigate('/risks')
  }

  const accountingTasks: HomeTaskItem[] = riskyRows.map(({ task, severity }) => ({
    id: task.id,
    label: 'Онлайн-бухгалтерия',
    title: task.title,
    due: dueLabel(severity, task.date) + (task.amount ? `, ${task.amount}` : ''),
    severity,
    onOpen: () => openAccountingTask(task.id, task.target),
  }))

  // Задачи других сервисов — демо-заглушки для показа стека. По макету
  // проявляются только при статусе «Серьёзно рискуете», в остальных
  // сценариях (включая «Всё в порядке») аккордеон задач пуст.
  const otherServiceTasks = aggregateStatus(levels) === 'overdue' ? OTHER_SERVICE_TASKS : []

  const homeTasks: HomeTaskItem[] = [...accountingTasks, ...otherServiceTasks]

  return (
    <div className="home-page">
      {/* Left sidebar */}
      <aside className="home-sidebar">
        <div className="home-sidebar__drop-area">
          <p className="home-sidebar__drop-title">Распознать платёж</p>
          <p className="home-sidebar__drop-subtitle">Фото, 1С или PDF</p>
        </div>

        <div className="home-sidebar__section">
          <div className="home-sidebar__section-header">
            <span className="home-sidebar__section-title">Быстрые действия</span>
            <ChevronsLeft size={20} color="var(--color-secondary)" />
          </div>
          <div className="home-sidebar__actions">
            {QUICK_ACTIONS.map((action) => (
              <button key={action.label} className="home-sidebar__action-item">
                <span className="home-sidebar__action-icon">{action.icon}</span>
                <span className="home-sidebar__action-label">{action.label}</span>
              </button>
            ))}
            <button className="home-sidebar__action-item home-sidebar__action-item--muted">
              <span className="home-sidebar__action-icon">
                <MoreHorizontal size={20} />
              </span>
              <span className="home-sidebar__action-label">Все действия</span>
            </button>
          </div>
        </div>

        <div className="home-sidebar__section">
          <div className="home-sidebar__section-header">
            <span className="home-sidebar__section-title">Мои сервисы</span>
          </div>
          <div className="home-sidebar__services">
            {SERVICES.map((service) => (
              <button key={service.label} className="home-sidebar__service-item">
                <div className="home-sidebar__service-avatar" style={{ background: service.color }} />
                <span className="home-sidebar__service-label">{service.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="home-page__content">
        <div className="home-main-col">
        {/* Search */}
        <div className="home-search">
          <Search size={18} color="var(--color-secondary)" className="home-search__icon" />
          <input className="home-search__input" placeholder="Поиск по Точке" readOnly />
        </div>

        {/* Стек задач: бухгалтерские риски + демо-задачи других сервисов. */}
        <TaskStack tasks={homeTasks} />

        {/* Accounts */}
        <div className="home-section">
          <div className="home-tabs">
            <button className="home-tab home-tab--active">Счета</button>
            <button className="home-tab">Валюта</button>
            <button className="home-tab">Фонды</button>
            <button className="home-tab">Карты</button>
          </div>

          <div className="home-accounts">
            {ACCOUNTS.map((acc, i) => (
              <div key={i} className="home-account-card">
                <div className="home-account-card__header">
                  <div className="home-account-card__type-row">
                    <span className="home-account-card__flag">🇷🇺</span>
                    <span className="home-account-card__type">{acc.type} {acc.mask}</span>
                  </div>
                  <button className="home-account-card__menu">•••</button>
                </div>
                <p className="home-account-card__amount">{acc.amount}</p>
              </div>
            ))}
          </div>

          <div className="home-accounts-total">
            <button className="home-pill">
              Всего 3 счёта на 904 275,37 ₽
              <ChevronRight size={16} />
            </button>
            <button className="home-accounts-total__eye"><EyeOff size={20} /></button>
            <button className="home-pill home-accounts-total__add">
              Добавить продукт <Plus size={16} />
            </button>
          </div>
        </div>

        {/* History */}
        <div className="home-section">
          <div className="home-tabs">
            <button className="home-tab home-tab--active">История</button>
            <button className="home-tab">
              На подпись <span className="home-badge">2</span>
            </button>
            <button className="home-tab">Автоплатежи</button>
          </div>

          <div className="home-history-card">
            <div className="home-filters">
              <div className="home-filters__line">
                <button className="home-chip home-chip--icon"><SlidersHorizontal size={18} /></button>
                <button className="home-chip">Все операции <ChevronDown size={12} /></button>
                <button className="home-chip">За всё время <ChevronDown size={12} /></button>
                <button className="home-chip">Счёт <ChevronDown size={12} /></button>
                <button className="home-chip">Карта <ChevronDown size={12} /></button>
              </div>
              <div className="home-filters__line">
                <button className="home-chip">Категория <ChevronDown size={12} /></button>
                <div className="home-chip home-chip--search">
                  <Search size={18} color="var(--color-secondary)" />
                  <input className="home-chip__input" placeholder="Контрагент, сумма, назначение" readOnly />
                </div>
              </div>
            </div>

            <p className="home-history-date">Сегодня, 2 апреля</p>

            <div className="home-transactions">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.ref} className="home-transaction">
                  <div className="home-transaction__left">
                    <p className="home-transaction__amount">{tx.amount}</p>
                    <p className="home-transaction__status">{tx.status}</p>
                  </div>
                  <div className="home-transaction__right">
                    <p className="home-transaction__counterparty">{tx.counterparty}</p>
                    <p className="home-transaction__desc">{tx.description}</p>
                    <p className="home-transaction__ref">{tx.ref}</p>
                  </div>
                  <div className="home-transaction__avatar" />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Правая колонка — виджет «Пульс бухгалтерии» */}
        <RiskRightColumn />
      </main>
    </div>
  )
}
