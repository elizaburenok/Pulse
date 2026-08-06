import type { CardContent, Severity } from '../../data/riskContent'
import './RiskCard.css'

interface Props {
  label: string
  level: Severity
  content: CardContent
  onClick?: () => void
}

/** Карточка категории риска. Цвет и текст — по уровню severity. */
export default function RiskCard({ label, level, content, onClick }: Props) {
  const interactive = level !== 'ok' && !!onClick

  return (
    <button
      type="button"
      className={`risk-card risk-card--${level}${interactive ? ' risk-card--interactive' : ''}`}
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
    >
      <span className="risk-card__label">{label}</span>
      <span className="risk-card__body">
        <span className="risk-card__title">{content.title}</span>
        <span className="risk-card__subtitle">{content.subtitle}</span>
      </span>
    </button>
  )
}
