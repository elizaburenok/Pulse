import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import './FlowResultModal.css'

interface Props {
  title: string
  children: ReactNode
  buttonLabel?: string
  onDone: () => void
}

/** Результат флоу (успех): модалка с галочкой, текстом и кнопкой «Готово». */
export default function FlowResultModal({ title, children, buttonLabel = 'Готово', onDone }: Props) {
  return (
    <div className="flow-result-overlay">
      <div className="flow-result" role="dialog" aria-label={title}>
        <div className="flow-result__body">
          <span className="flow-result__badge" aria-hidden="true">
            <Check size={24} color="var(--color-primary)" strokeWidth={2} />
          </span>
          <div className="flow-result__content">
            <h2 className="flow-result__title">{title}</h2>
            <div className="flow-result__text">{children}</div>
          </div>
        </div>
        <div className="flow-result__footer">
          <button className="flow-result__btn" onClick={onDone}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
