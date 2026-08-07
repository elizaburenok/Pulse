import { useState } from 'react'
import { ArrowLeft, Pencil, ClipboardList, ChevronDown } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRiskState } from '../context/RiskStateContext'
import { dueLabel } from '../data/riskContent'
import ConfirmActionSheet from '../components/risks/ConfirmActionSheet'
import FlowResultModal from '../components/risks/FlowResultModal'
import './DestinationPage.css'

/** Иконка «Расчёт налогов» — плюс-минус (Stroked 2px/Plus Minus из TUI Universal). */
function PlusMinusIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 19.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, color: 'var(--color-primitive-secondary)' }}
    >
      <path
        d="M17.793 0.792969C18.1835 0.40246 18.8165 0.402491 19.207 0.792969C19.5976 1.18349 19.5976 1.81651 19.207 2.20703L2.20703 19.207C1.8165 19.5975 1.18348 19.5975 0.792969 19.207C0.402507 18.8165 0.402508 18.1835 0.792969 17.793L17.793 0.792969ZM19 15C19.5523 15 20 15.4477 20 16C20 16.5523 19.5523 17 19 17H13C12.4477 17 12 16.5523 12 16C12 15.4477 12.4477 15 13 15H19ZM4 0C4.55228 0 5 0.447715 5 1V3H7C7.55228 3 8 3.44772 8 4C8 4.55228 7.55228 5 7 5H5V7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7V5H1C0.447715 5 0 4.55228 0 4C0 3.44772 0.447715 3 1 3H3V1C3 0.447715 3.44772 0 4 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function TaxPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { closeTask, levels } = useRiskState()
  const [toast, setToast] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const navState = location.state as { reopenDrawerId?: string; taskId?: string } | null
  const backState = navState?.reopenDrawerId ? { reopenDrawerId: navState.reopenDrawerId } : undefined

  function goBack() {
    navigate('/risks', { state: backState })
  }

  // Задача выполнена — закрываем её (исчезнет из списка) и возвращаемся.
  function done(msg: string) {
    setToast(msg)
    if (navState?.taskId) closeTask(navState.taskId)
    window.setTimeout(() => navigate('/risks', { state: backState }), 900)
  }

  // Подтвердили действие в Action Sheet — отправляем платёж и показываем результат флоу.
  function confirmPayment() {
    setShowConfirm(false)
    setShowResult(true)
  }

  // «Готово» в результате флоу: закрываем задачу и возвращаемся к рискам.
  function finishFromResult() {
    if (navState?.taskId) closeTask(navState.taskId)
    navigate('/risks', { state: backState })
  }

  return (
    <div className="dest-page">
      <button className="dest-back dest-back--outline" onClick={goBack} aria-label="Назад">
        <ArrowLeft size={20} />
      </button>

      <aside className="dest-rail">
        <p className="dest-rail__crumb">Онлайн-бухгалтерия ›</p>
        <h1 className="dest-rail__title">Налог по УСН</h1>
        <p className="dest-rail__sub">II квартал 2025</p>
      </aside>

      <main className="dest-main">
        <div className="dest-amount">
          <p className="dest-amount__value">486 973 ₽</p>
          <p className="dest-amount__due">{dueLabel(levels.taxes, '25 июля')}</p>
        </div>

        <button className="dest-chip" onClick={() => setToast('Изменение суммы недоступно в прототипе')}>
          <Pencil size={18} />
          Изменить сумму
        </button>

        <div className="dest-navigators">
          <button className="dest-tile" onClick={() => setToast('Расчёт налогов')}>
            <span className="dest-tile__text">
              <span className="dest-tile__title">Расчёт налогов</span>
              <span className="dest-tile__desc">Почему такая сумма?</span>
            </span>
            <PlusMinusIcon size={24} />
          </button>

          <button className="dest-tile" onClick={() => setToast('Реквизиты скопированы')}>
            <span className="dest-tile__text">
              <span className="dest-tile__title">Реквизиты получателя</span>
              <span className="dest-tile__desc">Единый налоговый счёт</span>
            </span>
            <ClipboardList size={22} color="var(--color-primitive-secondary)" />
          </button>
        </div>

        <button className="dest-account" onClick={() => setToast('Выбор счёта')}>
          <span className="dest-account__text">
            <span className="dest-account__label">Со счёта</span>
            <span className="dest-account__value">5 250 275,37 ₽ — Расчётный, **9804</span>
          </span>
          <span className="dest-account__accessory">
            <span className="dest-flag" aria-hidden="true" />
            <ChevronDown size={18} color="var(--color-primitive-secondary)" />
          </span>
        </button>
      </main>

      <div className="dest-footer">
        <button className="dest-btn dest-btn--secondary" onClick={() => done('Отмечено как уплачено')}>
          Уже уплачено
        </button>
        <button className="dest-btn dest-btn--primary" onClick={() => setShowConfirm(true)}>
          Уплатить
        </button>
      </div>

      {showConfirm && (
        <ConfirmActionSheet
          title="Уплатить 486 973 ₽?"
          actionLabel="Подписать и уплатить"
          onConfirm={confirmPayment}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showResult && (
        <FlowResultModal title="Налог по УСН уплачен!" onDone={finishFromResult}>
          <p>Отправили платёж 486 973 ₽.</p>
          <p>Налог по УСН за II квартал 2025 полностью уплачен.</p>
          <p>Информация по платежу появится в ленте событий в течение 5 минут.</p>
        </FlowResultModal>
      )}

      {toast && <div className="dest-toast">{toast}</div>}
    </div>
  )
}
