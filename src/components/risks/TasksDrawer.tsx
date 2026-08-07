import { X } from 'lucide-react'
import type { Task, TaskIcon } from '../../data/riskContent'
import taxesIcon from '../../logo/Taxes.png'
import contributionsIcon from '../../logo/Contributions.png'
import './TasksDrawer.css'

interface Props {
  open: boolean
  title: string
  tasks: Task[]
  onClose: () => void
  onSelect: (task: Task) => void
}

const ICON: Record<TaskIcon, string> = {
  taxes: taxesIcon,
  contributions: contributionsIcon,
}

/** Дровер со списком задач категории (когда задач больше одной). */
export default function TasksDrawer({ open, title, tasks, onClose, onSelect }: Props) {
  if (!open) return null

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__header">
          <span className="drawer__title">{title}</span>
          <button className="drawer__close" onClick={onClose} aria-label="Закрыть">
            <X size={24} />
          </button>
        </div>

        <ul className="drawer__list">
          {tasks.map((task) => (
            <li key={task.id}>
              <button className="drawer__item" onClick={() => onSelect(task)}>
                {task.icon ? (
                  <img className="drawer__logo" src={ICON[task.icon]} alt="" aria-hidden="true" />
                ) : (
                  <span className="drawer__logo drawer__logo--placeholder" aria-hidden="true" />
                )}
                <span className="drawer__item-text">
                  <span className="drawer__item-title">{task.title}</span>
                  <span className="drawer__item-due">до {task.date}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
