import { PenTool } from 'lucide-react'
import './ConfirmActionSheet.css'

interface Props {
  title: string
  actionLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** Подтверждение действия перед отправкой платежа: Action Sheet с одним действием и отменой. */
export default function ConfirmActionSheet({ title, actionLabel, onConfirm, onCancel }: Props) {
  return (
    <div className="confirm-sheet-overlay" onClick={onCancel}>
      <div
        className="confirm-sheet"
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-sheet__header">
          <p className="confirm-sheet__title">{title}</p>
        </div>
        <button className="confirm-sheet__action" onClick={onConfirm}>
          <PenTool size={30} color="var(--color-brand, #835de1)" strokeWidth={1.6} />
          <span className="confirm-sheet__action-label">{actionLabel}</span>
        </button>
        <div className="confirm-sheet__footer">
          <button className="confirm-sheet__cancel" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
