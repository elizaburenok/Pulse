// Общие хелперы для плоских списков задач (главная интернет-банка и
// онлайн-бухгалтерия читают один источник — useRiskState → openTasks/levels).

import { CATEGORY_ORDER, type CategoryId, type Severity, type Task } from './riskContent'
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

// ─── Текст-перечень задач для виджета «Пульс» и навигатора ────────────────────
// Короткий подзаголовок, который называет, что нужно сделать. Собирается по
// рисковым категориям (не только по задачам-объектам: операции могут быть
// красными без задач). См. план — тексты для рисков в «Пульсе».

/** Императив для случая «ровно одна задача» — по конкретному id задачи. */
const TASK_IMPERATIVE: Record<string, string> = {
  'usn-q2': 'Уплатите налог по УСН за II квартал',
  'contributions-2026': 'Уплатите взносы с доходов за 2026',
  'ens-notice': 'Отправьте уведомление по ЕНП',
}

/** Императив по категории — когда категория одна (несколько задач или без задач). */
function categoryImperative(id: CategoryId, severity: Severity): string {
  switch (id) {
    case 'reporting':
      return 'Отправьте уведомление'
    case 'taxes':
      return 'Уплатите налоги и взносы'
    case 'operations':
      return severity === 'overdue' ? 'Подключите маркетплейсы' : 'Уточните операции'
    case 'patent':
      return 'Уплатите налог по патенту'
    default:
      return 'Выполните задачи'
  }
}

/** Родительный фрагмент для перечня «Выполните задачи по …». */
function categoryGenitive(id: CategoryId, severity: Severity): string {
  switch (id) {
    case 'reporting':
      return 'отправке уведомления'
    case 'taxes':
      return 'уплате налогов'
    case 'operations':
      return severity === 'overdue' ? 'подключению маркетплейсов' : 'уточнению операций'
    case 'patent':
      return 'уплате налога по патенту'
    default:
      return ''
  }
}

/** Перечисление через «и»/запятые: [A] → A, [A,B] → «A и B», [A,B,C] → «A, B и C». */
function joinPhrases(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} и ${parts[parts.length - 1]}`
}

/**
 * Короткий текст-перечень задач для подзаголовка «Пульса». null — если рисковых
 * категорий с действием нет (тогда берём прежний статичный подзаголовок).
 * Категория `limit` в перечень не входит — у неё нет действия-задачи.
 */
export function riskSummaryText(
  openTasks: Record<CategoryId, Task[]>,
  levels: Record<CategoryId, Severity>,
): string | null {
  // Рисковые категории в каноническом порядке (кроме limit — нет действия).
  let risky = CATEGORY_ORDER.filter((id) => id !== 'limit' && levels[id] !== 'ok')
  if (risky.length === 0) return null

  // Если категорий несколько и есть красные — оставляем только красные.
  if (risky.length > 1 && risky.some((id) => levels[id] === 'overdue')) {
    risky = risky.filter((id) => levels[id] === 'overdue')
  }

  if (risky.length === 1) {
    const id = risky[0]
    const tasks = openTasks[id]
    if (tasks.length === 1 && TASK_IMPERATIVE[tasks[0].id]) {
      return TASK_IMPERATIVE[tasks[0].id]
    }
    return categoryImperative(id, levels[id])
  }

  const parts = risky.map((id) => categoryGenitive(id, levels[id])).filter(Boolean)
  return `Выполните задачи по ${joinPhrases(parts)}`
}
