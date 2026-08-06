import { useState } from 'react'
import { ArrowLeft, Pencil, Scale, Copy, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './DestinationPage.css'

export default function TaxPaymentPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)

  function done(msg: string) {
    setToast(msg)
    window.setTimeout(() => navigate('/risks'), 900)
  }

  return (
    <div className="dest-page">
      <button className="dest-back" onClick={() => navigate('/risks')} aria-label="Назад">
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
          <p className="dest-amount__due">до 28 июля</p>
          <button className="dest-chip" onClick={() => setToast('Изменение суммы недоступно в прототипе')}>
            <Pencil size={16} />
            Изменить сумму
          </button>
        </div>

        <button className="dest-tile" onClick={() => setToast('Расчёт налогов')}>
          <span className="dest-tile__text">
            <span className="dest-tile__title">Расчёт налогов</span>
            <span className="dest-tile__desc">Почему такая сумма?</span>
          </span>
          <Scale size={22} color="var(--color-primitive-secondary)" />
        </button>

        <button className="dest-tile" onClick={() => setToast('Реквизиты скопированы')}>
          <span className="dest-tile__text">
            <span className="dest-tile__title">Реквизиты получателя</span>
            <span className="dest-tile__desc">Единый налоговый счёт</span>
          </span>
          <Copy size={20} color="var(--color-primitive-secondary)" />
        </button>

        <button className="dest-account" onClick={() => setToast('Выбор счёта')}>
          <span className="dest-account__text">
            <span className="dest-account__label">Со счёта</span>
            <span className="dest-account__value">5 250 275,37 ₽ — Расчётный, **9804</span>
          </span>
          <ChevronDown size={18} color="var(--color-primitive-secondary)" />
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
