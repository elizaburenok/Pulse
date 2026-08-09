// Общие хелперы для плоских списков задач (главная интернет-банка и
// онлайн-бухгалтерия читают один источник — useRiskState → openTasks/levels).

import { type CategoryId, type Severity, type Task } from './riskContent'
import taxesLogo from '../logo/Taxes.png'
import contributionsLogo from '../logo/Contributions.png'
import reportLogo from '../logo/Report.svg'

/** Приоритет срочности для сортировки: просрочка → внимание → норма. */
export const RANK: Record<Severity, number> = { overdue: 0, attention: 1, ok: 2 }

// Налоги раньше отчётности — так при равном сроке (25 июля) налог по УСН
// оказывается выше уведомления по ЕНП, как в макете.
const TASK_ORDER: CategoryId[] = ['taxes', 'reporting', 'operations', 'limit', 'patent']

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

/** Числовой ключ срока «25 июля» для сортировки по срочности. */
export function dueKey(date: string): number {
  const [dayStr, monthStr] = date.split(' ')
  const day = Number.parseInt(dayStr, 10) || 0
  const month = MONTHS.indexOf(monthStr)
  return (month < 0 ? 12 : month) * 100 + day
}

/** Логотип задачи — из библиотеки logo. Уведомления (без icon) → «Report». */
export function taskLogo(task: Task): string {
  if (task.icon === 'taxes') return taxesLogo
  if (task.icon === 'contributions') return contributionsLogo
  return reportLogo
}

export interface TaskRow {
  task: Task
  severity: Severity
}

/** Плоский список задач всех категорий, отсортированный по срочности. */
export function taskRows(
  openTasks: Record<CategoryId, Task[]>,
  levels: Record<CategoryId, Severity>,
): TaskRow[] {
  return TASK_ORDER.flatMap((id) =>
    openTasks[id].map((task) => ({ task, severity: levels[id] })),
  ).sort((a, b) => RANK[a.severity] - RANK[b.severity] || dueKey(a.task.date) - dueKey(b.task.date))
}

/** Только рисковые задачи (категория не «ok») — для баннера и виджета главной. */
export function riskyTaskRows(
  openTasks: Record<CategoryId, Task[]>,
  levels: Record<CategoryId, Severity>,
): TaskRow[] {
  return taskRows(openTasks, levels).filter((row) => row.severity !== 'ok')
}
