import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { SCENARIOS, type Scenario, type ScenarioId } from '../data/scenarios'
import type { CategoryId, Severity } from '../data/riskContent'

interface RiskStateValue {
  scenarioId: ScenarioId
  setScenarioId: (id: ScenarioId) => void
  scenario: Scenario
  /** Уровни риска по категориям для текущего сценария. */
  levels: Record<CategoryId, Severity>
}

const RiskStateContext = createContext<RiskStateValue | null>(null)

export function RiskStateProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('ok')

  const value = useMemo<RiskStateValue>(() => {
    const scenario = SCENARIOS[scenarioId]
    const levels = Object.fromEntries(
      Object.entries(scenario.levels).map(([id, cfg]) => [id, cfg.level]),
    ) as Record<CategoryId, Severity>
    return { scenarioId, setScenarioId, scenario, levels }
  }, [scenarioId])

  return <RiskStateContext.Provider value={value}>{children}</RiskStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRiskState(): RiskStateValue {
  const ctx = useContext(RiskStateContext)
  if (!ctx) throw new Error('useRiskState must be used within RiskStateProvider')
  return ctx
}
