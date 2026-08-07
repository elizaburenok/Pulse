import { RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../../context/RiskStateContext'
import { SCENARIOS, SCENARIO_ORDER } from '../../data/scenarios'
import './StateToggle.css'

/** Плавающий служебный тумблер: выбор сценария для UX-теста. Вне макета. */
export default function StateToggle() {
  const navigate = useNavigate()
  const { scenarioId, setScenarioId, resetActions } = useRiskState()

  // Сброс всех закрытых задач текущего сценария и возврат на главную —
  // чтобы можно было пройти прототип заново, не выбирая сценарий заново.
  function reset() {
    resetActions()
    navigate('/')
  }

  // Точка входа зависит от статуса. «Обратите внимание» (сценарий risk) —
  // вход из онлайн-бухгалтерии, поэтому переключение на него открывает
  // страницу /accounting. Для «Всё в порядке» и «Серьёзно рискуете» точка
  // входа — интернет-банк, навигацию не форсируем (остаёмся где были).
  // Навигация завязана только на смену сценария, а не на закрытие задач,
  // поэтому если клиент закроет задачи и статус станет «Всё в порядке» —
  // он бесшовно останется в онлайн-бухгалтерии.
  function selectScenario(id: (typeof SCENARIO_ORDER)[number]) {
    setScenarioId(id)
    if (id === 'risk') navigate('/accounting')
  }

  return (
    <div className="state-toggle" role="group" aria-label="Состояние прототипа">
      {SCENARIO_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          className={
            id === scenarioId ? 'state-toggle__btn state-toggle__btn--on' : 'state-toggle__btn'
          }
          onClick={() => selectScenario(id)}
        >
          {SCENARIOS[id].label}
        </button>
      ))}
      <div className="state-toggle__divider" aria-hidden="true" />
      <button
        type="button"
        className="state-toggle__btn state-toggle__btn--reset"
        onClick={reset}
        title="Сбросить действия и начать сначала"
      >
        <RotateCcw size={14} />
        Сбросить
      </button>
    </div>
  )
}
