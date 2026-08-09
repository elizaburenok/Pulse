import { useState } from 'react'
import type { Severity } from '../../data/riskContent'
import './TaskStack.css'

const RANK: Record<Severity, number> = { overdue: 0, attention: 1, ok: 2 }

export interface HomeTaskItem {
  id: string
  /** Сервис-источник задачи, напр. «Онлайн-бухгалтерия», «Комплаенс». */
  label: string
  title: string
  due: string
  severity: Severity
  /** Нет обработчика — задача не кликабельна (демо-заглушка стороннего сервиса). */
  onOpen?: () => void
}

function CardBody({ task }: { task: HomeTaskItem }) {
  return (
    <>
      <p className="task-card__label">{task.label}</p>
      <p className="task-card__title">{task.title}</p>
      <p className="task-card__due">{task.due}</p>
    </>
  )
}

function cardClass(task: HomeTaskItem): string {
  return task.severity === 'overdue' ? 'task-card task-card--overdue' : 'task-card'
}

function ExpandedCard({ task }: { task: HomeTaskItem }) {
  if (task.onOpen) {
    return (
      <button className={cardClass(task)} onClick={task.onOpen}>
        <CardBody task={task} />
      </button>
    )
  }
  return (
    <div className={cardClass(task)}>
      <CardBody task={task} />
    </div>
  )
}

/**
 * Стек задач главной страницы (Bank-Patterns, node 82343-57751). 1–3 задачи —
 * показываем все по приоритету, друг за другом. Больше трёх — только первая
 * (самая критичная) с «выглядывающей» карточкой позади; клик по ней
 * разворачивает весь список.
 */
export default function TaskStack({ tasks }: { tasks: HomeTaskItem[] }) {
  const [expanded, setExpanded] = useState(false)
  if (tasks.length === 0) return null

  const sorted = [...tasks].sort((a, b) => RANK[a.severity] - RANK[b.severity])

  if (sorted.length <= 3 || expanded) {
    return (
      <div className="task-stack">
        {sorted.map((task) => (
          <ExpandedCard key={task.id} task={task} />
        ))}
      </div>
    )
  }

  return (
    <div className="task-stack">
      <button
        className="task-stack__peek-wrap"
        onClick={() => setExpanded(true)}
        aria-label={`Показать ещё задачи: ${sorted.length - 1}`}
      >
        <div className={cardClass(sorted[0])}>
          <CardBody task={sorted[0]} />
        </div>
        <span className="task-stack__peek" />
      </button>
    </div>
  )
}
