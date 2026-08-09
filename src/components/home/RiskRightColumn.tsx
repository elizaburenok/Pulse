import { ChevronRight, ChevronsRight, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../../context/RiskStateContext'
import { aggregateStatus, dueLabel, type PageStatus } from '../../data/riskContent'
import { riskyTaskRows, taskLogo } from '../../data/tasks'
import PulseFace from '../risks/PulseFace'
import taxesLogo from '../../logo/Taxes.png'
import contributionsLogo from '../../logo/Contributions.png'
import declarationLogo from '../../logo/Declaration.png'
import './RiskRightColumn.css'

const WIDGET_TEXT: Record<PageStatus, { title: string; subtitle: string }> = {
  ok: { title: 'Всё в порядке', subtitle: 'В бухгалтерии всё корректно, а вы справляетесь безупречно' },
  attention: { title: 'Обратите внимание', subtitle: 'Решите вопросы, чтобы не получить пени' },
  overdue: { title: 'Серьёзно рискуете', subtitle: 'Решите вопросы, чтобы избежать блокировки' },
}

interface WidgetTask {
  key: string
  logo: string
  title: string
  due: string
  overdue: boolean
}

// Будущие задачи для статуса «Всё в порядке»: срок ещё не подошёл (после
// 2026-08-09), это не риск — показываем нейтрально «До …».
const UPCOMING_TASKS: WidgetTask[] = [
  { key: 'u-usn-q3', logo: taxesLogo, title: 'Налог по УСН за III кв. 2026', due: 'До 28 октября, 486 973 ₽', overdue: false },
  { key: 'u-contributions', logo: contributionsLogo, title: 'Взносы с доходов за 2026', due: 'До 31 декабря, 45 842 ₽', overdue: false },
  { key: 'u-declaration', logo: declarationLogo, title: 'Декларация по УСН за 2026', due: 'До 27 апреля 2027', overdue: false },
]

/** Правая колонка главной: виджет «Пульс бухгалтерии» (вход в раздел рисков). */
export default function RiskRightColumn() {
  const navigate = useNavigate()
  const { openTasks, levels, setEntryPath } = useRiskState()
  const status = aggregateStatus(levels)
  const text = WIDGET_TEXT[status]

  // Задачи бухгалтерии: если есть рисковые (срок близко/вышел) — показываем их
  // синхронно со статусом; иначе — будущие задачи (срок ещё не подошёл).
  const riskyRows = riskyTaskRows(openTasks, levels)
  const widgetTasks: WidgetTask[] =
    riskyRows.length > 0
      ? riskyRows.map(({ task, severity }) => ({
          key: task.id,
          logo: taskLogo(task),
          title: task.title,
          due: dueLabel(severity, task.date) + (task.amount ? `, ${task.amount}` : ''),
          overdue: severity === 'overdue',
        }))
      : UPCOMING_TASKS

  // Вход во флоу рисков из виджета интернет-банка — «Назад» вернёт на главную.
  function openRisks() {
    setEntryPath('/')
    navigate('/risks')
  }

  return (
    <aside className="right-col">
      <div className="right-col__header">
        <ChevronsRight size={24} color="var(--color-secondary)" />
        <span className="right-col__header-title">Компания</span>
        <SlidersHorizontal size={22} color="var(--color-secondary)" />
      </div>

      <button
        className="pulse-widget"
        onClick={openRisks}
        aria-label="Открыть Пульс бухгалтерии"
      >
        <div className="pulse-widget__head">
          <span className="pulse-widget__title">Пульс бухгалтерии</span>
          <ChevronRight size={18} color="var(--color-primitive-primary)" />
        </div>
        <div className="pulse-widget__body">
          <PulseFace status={status} size={40} />
          <div className="pulse-widget__text">
            <p className="pulse-widget__status">{text.title}</p>
            <p className="pulse-widget__desc">{text.subtitle}</p>
          </div>
        </div>
      </button>

      <div className="side-card">
        <button className="side-card__head side-card__head--link" onClick={openRisks}>
          <span className="side-card__title">Задачи бухгалтерии</span>
          <ChevronRight size={18} color="var(--color-primitive-primary)" />
        </button>
        <ul className="side-card__list">
          {widgetTasks.map((task) => (
            <li key={task.key} className="side-card__item">
              <img className="side-card__dot" src={task.logo} alt="" aria-hidden="true" />
              <div className="side-card__item-text">
                <p className="side-card__item-title">{task.title}</p>
                <p
                  className={
                    task.overdue
                      ? 'side-card__item-desc side-card__item-desc--overdue'
                      : 'side-card__item-desc'
                  }
                >
                  {task.due}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <button className="side-card__more" onClick={openRisks}>Показать все</button>
      </div>

      <div className="risk-biz">
        <div className="risk-biz__head">
          <span className="risk-biz__title">Риски бизнеса</span>
          <ChevronRight size={18} color="var(--color-primitive-primary)" />
        </div>
        <div className="risk-biz__body">
          <p className="risk-biz__label">Низкий риск по операциям</p>
          <div className="risk-biz__bars">
            <span className="risk-biz__bar">
              <span className="risk-biz__bar-fill" style={{ width: '60%' }} />
            </span>
            <span className="risk-biz__bar" />
            <span className="risk-biz__bar" />
          </div>
          <p className="risk-biz__caption">Можно отслеживать ещё 5 рисков</p>
        </div>
      </div>
    </aside>
  )
}
