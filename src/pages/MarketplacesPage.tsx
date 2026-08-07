import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRiskState } from '../context/RiskStateContext'
import FlowResultModal from '../components/risks/FlowResultModal'
import basketIllustration from '../logo/MarketplaceBasket.svg'
import './DestinationPage.css'

const CONNECT_STEPS = [
  'Перейдите в раздел «Маркетплейсы»',
  'Выберите нужную площадку из списка доступных',
  'Введите API-ключ из личного кабинета маркетплейса',
  'Всё готово: сервис начнёт учитывать данные автоматически',
]

/**
 * Информирование, зачем подключать маркетплейсы (node 40000827-36474).
 * Открывается из рисковой карточки «Операции» в статусе «Серьёзно рискуете».
 */
export default function MarketplacesPage() {
  const navigate = useNavigate()
  const { clearCategory } = useRiskState()
  const [showResult, setShowResult] = useState(false)

  // «Подключить» → показываем результат, по «Готово» гасим риск операций.
  function finishFromResult() {
    clearCategory('operations')
    navigate('/risks')
  }

  return (
    <div className="dest-page dest-page--mp">
      <button className="dest-back" onClick={() => navigate('/risks')} aria-label="Назад">
        <ArrowLeft size={20} />
      </button>

      <main className="mp-content">
        <header className="mp-header">
          <img className="mp-illustration" src={basketIllustration} alt="" aria-hidden="true" />
          <div className="mp-title-block">
            <h1 className="mp-title">Подключите маркетплейсы для учёта дохода</h1>
            <p className="mp-due">до 25 апреля</p>
          </div>
        </header>

        <section className="mp-block">
          <h2 className="mp-block__title">Почему важно подключить маркетплейсы</h2>
          <p className="mp-block__text">
            К вашим доходам от продаж относится компенсация от площадки и вся сумма, которую заплатил
            покупатель за товар — до вычета комиссии. Эти данные есть в отчётах маркетплейсов — без них
            мы не сможем корректно учесть доходы.
          </p>
          <p className="mp-block__text">
            Хотим уберечь вас от возможных вопросов ФНС и правильно рассчитать налог. Для этого нужно
            подключить автозагрузку отчётов маркетплейсов по API.
          </p>
        </section>

        <section className="mp-block">
          <h2 className="mp-block__title">Как подключить маркетплейс по API</h2>
          <ol className="mp-steps">
            {CONNECT_STEPS.map((step, i) => (
              <li key={i} className="mp-step">
                <span className="mp-step__num">{i + 1}.</span>
                <span className="mp-step__text">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <div className="dest-footer dest-footer--single">
        <button className="dest-btn dest-btn--primary dest-btn--wide" onClick={() => setShowResult(true)}>
          Подключить
        </button>
      </div>

      {showResult && (
        <FlowResultModal title="Маркетплейс подключён!" onDone={finishFromResult}>
          <p>Отчёты маркетплейса будут загружаться автоматически по API.</p>
          <p>Мы учтём доходы от продаж и корректно рассчитаем налог.</p>
        </FlowResultModal>
      )}
    </div>
  )
}
