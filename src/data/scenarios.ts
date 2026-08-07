// 3 сценария под тумблер прототипа. Каждый — посегментная конфигурация
// уровней риска + задачи активных категорий. Всё остальное (агрегат-статус,
// порядок карточек, шапка) вычисляется из этого конфига.

import type { CategoryId, Severity, Task } from './riskContent'

export type ScenarioId = 'ok' | 'risk' | 'threat'

export interface ScenarioCategory {
  level: Severity
  /** Задачи категории. 1 → сразу на страницу, >1 → дровер. */
  tasks: Task[]
}

export interface Scenario {
  id: ScenarioId
  /** Подпись сегмента тумблера. */
  label: string
  levels: Record<CategoryId, ScenarioCategory>
}

const ok = (): ScenarioCategory => ({ level: 'ok', tasks: [] })

/** Две задачи по налогам → открывают дровер. */
const taxTasks: Task[] = [
  { id: 'usn-q2', title: 'Налог по УСН за II кв. 2025', date: '25 июля', target: 'tax', icon: 'taxes' },
  {
    id: 'contributions-2026',
    title: 'Взносы с доходов за 2026',
    date: '28 июля',
    target: 'contributions',
    icon: 'contributions',
  },
]

/** Одна задача по отчётности → сразу на страницу ЕНП. */
const reportingTask: Task[] = [
  { id: 'ens-notice', title: 'Уведомление по ЕНП', date: '25 июля', target: 'ens' },
]

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  ok: {
    id: 'ok',
    label: 'Всё хорошо',
    levels: {
      taxes: ok(),
      reporting: ok(),
      operations: ok(),
      limit: ok(),
      patent: ok(),
    },
  },
  risk: {
    id: 'risk',
    label: 'Есть риск',
    levels: {
      taxes: { level: 'attention', tasks: taxTasks },
      reporting: { level: 'attention', tasks: reportingTask },
      operations: ok(),
      limit: ok(),
      patent: ok(),
    },
  },
  threat: {
    id: 'threat',
    label: 'Угроза блокировки',
    levels: {
      taxes: { level: 'overdue', tasks: taxTasks },
      reporting: { level: 'overdue', tasks: reportingTask },
      operations: ok(),
      // жёлтый лимит для наглядности смешанной сетки (кадр 40000797-19242)
      limit: { level: 'attention', tasks: [] },
      patent: ok(),
    },
  },
}

export const SCENARIO_ORDER: ScenarioId[] = ['ok', 'risk', 'threat']
