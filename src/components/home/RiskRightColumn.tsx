import { ChevronRight, ChevronsRight, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../../context/RiskStateContext'
import { aggregateStatus, type PageStatus } from '../../data/riskContent'
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

const TASKS = [
  {
    title: 'Страховые взносы в I кв. за 2020',
    desc: '5 800 ₽, с 1 по 25 августа',
    logo: contributionsLogo,
  },
  {
    title: 'Налог по УСН в I кв. за 2020',
    desc: '120 375,78 ₽, с 27 сентября по 15 октября 2020',
    logo: taxesLogo,
  },
  {
    title: 'Декларация УСН за 2019',
    desc: 'С 3 по 20 октября',
    logo: declarationLogo,
  },
]

/** Правая колонка главной: виджет «Пульс бухгалтерии» (вход в раздел рисков). */
export default function RiskRightColumn() {
  const navigate = useNavigate()
  const { levels } = useRiskState()
  const status = aggregateStatus(levels)
  const text = WIDGET_TEXT[status]

  return (
    <aside className="right-col">
      <div className="right-col__header">
        <ChevronsRight size={24} color="var(--color-secondary)" />
        <span className="right-col__header-title">Компания</span>
        <SlidersHorizontal size={22} color="var(--color-secondary)" />
      </div>

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
          {TASKS.map((task) => (
            <li key={task.title} className="side-card__item">
              <img className="side-card__dot" src={task.logo} alt="" aria-hidden="true" />
              <div className="side-card__item-text">
                <p className="side-card__item-title">{task.title}</p>
                <p className="side-card__item-desc">{task.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <button className="side-card__more">Показать все</button>
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
