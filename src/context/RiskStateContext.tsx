import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SCENARIOS, type Scenario, type ScenarioId } from '../data/scenarios'
import { CATEGORY_ORDER, type CategoryId, type Severity, type Task } from '../data/riskContent'

interface RiskStateValue {
  scenarioId: ScenarioId
  setScenarioId: (id: ScenarioId) => void
  scenario: Scenario
  /** Уровни риска по категориям с учётом закрытых задач. */
  levels: Record<CategoryId, Severity>
  /** Ещё не закрытые задачи по категориям. */
  openTasks: Record<CategoryId, Task[]>
  /**
   * Закрыть задачу: она исчезает из списков, а когда закрыты все задачи
   * категории — её риск гаснет (уровень становится «ok»). Когда гаснут все
   * категории, агрегат-статус тоже становится «в норме».
   */
  closeTask: (id: string) => void
  /**
   * Погасить риск категории целиком — для категорий без задач (напр. операции:
   * риск снимается подключением маркетплейсов, а не закрытием задач).
   */
  clearCategory: (id: CategoryId) => void
  /** Сбросить закрытые задачи текущего сценария — для повторного тестирования. */
  resetActions: () => void
  /** Путь, откуда вошли во флоу рисков — куда возвращает «Назад» на странице риска. */
  entryPath: string
  setEntryPath: (path: string) => void
}

const RiskStateContext = createContext<RiskStateValue | null>(null)

export function RiskStateProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioIdState] = useState<ScenarioId>('ok')
  const [closedIds, setClosedIds] = useState<Set<string>>(() => new Set())
  const [clearedCats, setClearedCats] = useState<Set<CategoryId>>(() => new Set())
  const [entryPath, setEntryPath] = useState('/')

  // Переключение сценария — чистый лист: закрытые задачи и категории сбрасываются.
  const setScenarioId = useCallback((id: ScenarioId) => {
    setScenarioIdState(id)
    setClosedIds(new Set())
    setClearedCats(new Set())
  }, [])

  const closeTask = useCallback((id: string) => {
    setClosedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const clearCategory = useCallback((id: CategoryId) => {
    setClearedCats((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const resetActions = useCallback(() => {
    setClosedIds(new Set())
    setClearedCats(new Set())
  }, [])

  const value = useMemo<RiskStateValue>(() => {
    const scenario = SCENARIOS[scenarioId]

    const openTasks = Object.fromEntries(
      CATEGORY_ORDER.map((id) => [
        id,
        scenario.levels[id].tasks.filter((t) => !closedIds.has(t.id)),
      ]),
    ) as Record<CategoryId, Task[]>

    const levels = Object.fromEntries(
      CATEGORY_ORDER.map((id) => {
        const cfg = scenario.levels[id]
        // Категория без задач гаснет, если её погасили напрямую (clearCategory).
        if (clearedCats.has(id)) return [id, 'ok']
        // Категория с задачами гаснет, когда все её задачи закрыты.
        const cleared = cfg.level !== 'ok' && cfg.tasks.length > 0 && openTasks[id].length === 0
        return [id, cleared ? 'ok' : cfg.level]
      }),
    ) as Record<CategoryId, Severity>

    return { scenarioId, setScenarioId, scenario, levels, openTasks, closeTask, clearCategory, resetActions, entryPath, setEntryPath }
  }, [scenarioId, closedIds, clearedCats, setScenarioId, closeTask, clearCategory, resetActions, entryPath])

  return <RiskStateContext.Provider value={value}>{children}</RiskStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRiskState(): RiskStateValue {
  const ctx = useContext(RiskStateContext)
  if (!ctx) throw new Error('useRiskState must be used within RiskStateProvider')
  return ctx
}
