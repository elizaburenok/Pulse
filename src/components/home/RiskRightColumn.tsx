import { ChevronRight, ChevronsRight, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../../context/RiskStateContext'
import { aggregateStatus, type PageStatus } from '../../data/riskContent'
import { riskSummaryText } from '../../data/tasks'
import PulseFace from '../risks/PulseFace'
import './RiskRightColumn.css'

const WIDGET_TEXT: Record<PageStatus, { title: string; subtitle: string }> = {
  ok: { title: 'Всё в порядке', subtitle: 'В бухгалтерии всё корректно, а вы справляетесь безупречно' },
  attention: { title: 'Обратите внимание', subtitle: 'Решите вопросы, чтобы не получить пени' },
  overdue: { title: 'Серьёзно рискуете', subtitle: 'Решите вопросы, чтобы избежать блокировки' },
}

/** Правая колонка главной: виджет «Пульс бухгалтерии» (вход в раздел рисков). */
export default function RiskRightColumn() {
  const navigate = useNavigate()
  const { openTasks, levels, setEntryPath } = useRiskState()
  const status = aggregateStatus(levels)
  // Подзаголовок называет, что нужно сделать (перечень задач). В статусе «ok»
  // задач нет — берём прежний статичный текст.
  const subtitle = riskSummaryText(openTasks, levels) ?? WIDGET_TEXT[status].subtitle

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
            <p className="pulse-widget__status">{WIDGET_TEXT[status].title}</p>
            <p className="pulse-widget__desc">{subtitle}</p>
          </div>
        </div>
      </button>

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
