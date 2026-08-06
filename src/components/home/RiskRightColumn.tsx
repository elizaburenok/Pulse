import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../../context/RiskStateContext'
import { aggregateStatus, type PageStatus } from '../../data/riskContent'
import PulseFace from '../risks/PulseFace'
import './RiskRightColumn.css'

const WIDGET_TEXT: Record<PageStatus, { title: string; subtitle: string }> = {
  ok: { title: 'Всё в порядке', subtitle: 'Бухгалтерия ведётся корректно, так держать' },
  attention: { title: 'Требует внимания', subtitle: 'Есть задачи к выполнению по срокам' },
  overdue: { title: 'Есть проблемы', subtitle: 'Решите вопросы, чтобы избежать блокировки' },
}

/** Правая колонка главной: виджет «Пульс бухгалтерии» (вход в раздел рисков). */
export default function RiskRightColumn() {
  const navigate = useNavigate()
  const { levels } = useRiskState()
  const status = aggregateStatus(levels)
  const text = WIDGET_TEXT[status]

  return (
    <aside className="right-col">
      <button
        className="pulse-widget"
        onClick={() => navigate('/risks')}
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
        <div className="side-card__head">
          <span className="side-card__title">Задачи бухгалтерии</span>
          <ChevronRight size={18} color="var(--color-primitive-primary)" />
        </div>
        <ul className="side-card__list">
          <li className="side-card__item">
            <span className="side-card__dot side-card__dot--pink" />
            <div>
              <p className="side-card__item-title">Страховые взносы в I кв.</p>
              <p className="side-card__item-desc">5 800 ₽, с 1 по 25 августа</p>
            </div>
          </li>
          <li className="side-card__item">
            <span className="side-card__dot side-card__dot--green" />
            <div>
              <p className="side-card__item-title">Налог по УСН в I кв.</p>
              <p className="side-card__item-desc">120 375,78 ₽, с 27 сентября</p>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  )
}
