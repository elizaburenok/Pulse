import { useState } from 'react'
import { ArrowLeft, Pencil, ClipboardList, ChevronDown } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import './DestinationPage.css'

export default function ContributionsPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [toast, setToast] = useState<string | null>(null)
  const backState = location.state ?? undefined

  function goBack() {
    navigate('/risks', { state: backState })
  }

  function done(msg: string) {
    setToast(msg)
    window.setTimeout(() => navigate('/risks', { state: backState }), 900)
  }

  return (
    <div className="dest-page dest-page--contrib">
      <button className="dest-back" onClick={goBack} aria-label="Назад">
        <ArrowLeft size={20} />
      </button>

      <aside className="dest-rail">
        <p className="dest-rail__crumb">Онлайн-бухгалтерия ›</p>
        <h1 className="dest-rail__title">Фиксированные взносы</h1>
        <p className="dest-rail__sub">За 2025</p>
      </aside>

      <main className="dest-main">
        <div className="dest-amount">
          <p className="dest-amount__value">25 369 ₽</p>
          <p className="dest-amount__due">до 28 декабря</p>
        </div>

        <button className="dest-chip" onClick={() => setToast('Изменение суммы недоступно в прототипе')}>
          <Pencil size={18} />
          Изменить сумму
        </button>

        <p className="dest-desc">
          Взносы можно уплачивать любыми частями: так вы равномерно распределите финансовую нагрузку в
          течение года. Срок уплаты больше не влияет на уменьшение налога по УСН. По желанию вы можете
          отредактировать сумму платежа.
        </p>

        <div className="dest-context">
          <div className="dest-context__cell">
            <p>
              По закону каждый предприниматель должен уплатить в этом году фиксированные взносы в
              Социальный фонд, даже если не было доходов. Вы стали ИП не с начала года, поэтому сумма
              взносов будет меньше.
            </p>
          </div>
          <div className="dest-context__cell">
            <span className="dest-context__label">Общая сумма взносов</span>
            <span className="dest-context__value">25 369 ₽</span>
          </div>
        </div>

        <button className="dest-tile" onClick={() => setToast('Реквизиты скопированы')}>
          <span className="dest-tile__text">
            <span className="dest-tile__title">Реквизиты получателя</span>
            <span className="dest-tile__desc">Единый налоговый счёт</span>
          </span>
          <ClipboardList size={22} color="var(--color-primitive-secondary)" />
        </button>

        <button className="dest-account" onClick={() => setToast('Выбор счёта')}>
          <span className="dest-account__text">
            <span className="dest-account__label">Со счёта</span>
            <span className="dest-account__value">5 250 275,37 ₽ — Расчётный, **9030</span>
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
        <button className="dest-btn dest-btn--primary" onClick={() => done('Платёж отправлен')}>
          Уплатить
        </button>
      </div>

      {toast && <div className="dest-toast">{toast}</div>}
    </div>
  )
}
