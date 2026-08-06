import { useRiskState } from '../../context/RiskStateContext'
import { SCENARIOS, SCENARIO_ORDER } from '../../data/scenarios'
import './StateToggle.css'

/** Плавающий служебный тумблер: выбор сценария для UX-теста. Вне макета. */
export default function StateToggle() {
  const { scenarioId, setScenarioId } = useRiskState()

  return (
    <div className="state-toggle" role="group" aria-label="Состояние прототипа">
      {SCENARIO_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          className={
            id === scenarioId ? 'state-toggle__btn state-toggle__btn--on' : 'state-toggle__btn'
          }
          onClick={() => setScenarioId(id)}
        >
          {SCENARIOS[id].label}
        </button>
      ))}
    </div>
  )
}
