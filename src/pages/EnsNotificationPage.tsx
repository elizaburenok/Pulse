import { useState } from 'react'
import { ArrowLeft, ChevronRight, Circle, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './DestinationPage.css'

const CHECK_ITEMS = [
  { n: 1, title: 'Система налогообложения', desc: 'УСН «Доходы» — 6%' },
  { n: 2, title: 'Патенты', desc: 'добавьте, если применяли' },
  { n: 3, title: 'Операции', desc: 'на 12 874 783 ₽ облагаются налогом' },
  { n: 4, title: 'Отчёты маркетплейсов', desc: '2 отчёта с Wildberries' },
]

export default function EnsNotificationPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)

  function done(msg: string) {
    setToast(msg)
    window.setTimeout(() => navigate('/risks'), 900)
  }

  return (
    <div className="dest-page dest-page--wide">
      <button className="dest-back" onClick={() => navigate('/risks')} aria-label="Назад">
        <ArrowLeft size={20} />
      </button>

      <aside className="dest-rail">
        <p className="dest-rail__crumb">Онлайн-бухгалтерия ›</p>
        <h1 className="dest-rail__title">Уведомление по единому налоговому платежу</h1>
        <p className="dest-rail__sub">за II квартал 2025</p>
      </aside>

      <main className="dest-main dest-main--ens">
        <h2 className="ens-title">Проверьте и отправьте уведомление до 25 июля</h2>
        <p className="ens-sub">Тогда налоговая верно учтёт ваши налоги и страховые взносы</p>

        <p className="ens-group">Посмотрите данные за II квартал 2025 года</p>
        <ul className="ens-list">
          {CHECK_ITEMS.map((it) => (
            <li key={it.n} className="ens-item">
              <span className="ens-item__num">{it.n}</span>
              <span className="ens-item__text">
                <span className="ens-item__title">{it.title}</span>
                <span className="ens-item__desc">{it.desc}</span>
              </span>
              <Circle size={20} color="var(--color-primitive-neutral-2, #d4d4d4)" />
            </li>
          ))}
        </ul>

        <p className="ens-group">Расскажите про деятельность вне Точка Банка</p>
        <ul className="ens-list">
          <li className="ens-item">
            <span className="ens-item__num">5</span>
            <span className="ens-item__text">
              <span className="ens-item__title">Доходы</span>
              <span className="ens-item__desc">
                Загрузите выписку в формате 1С и проверьте систему налогообложения
              </span>
            </span>
            <Circle size={20} color="var(--color-primitive-neutral-2, #d4d4d4)" />
          </li>
        </ul>
      </main>

      <aside className="ens-side">
        <button className="ens-side-card" onClick={() => setToast('Расчёт налогов')}>
          <span className="ens-side-card__head">
            Расчёт налогов
            <ChevronRight size={16} color="var(--color-primitive-primary)" />
          </span>
          <span className="ens-side-card__row">
            <span className="ens-side-card__logo" />
            <span className="ens-side-card__text">
              <span className="ens-side-card__title">Налог по УСН в III кв. за 2…</span>
              <span className="ens-side-card__desc">56 630 ₽</span>
            </span>
          </span>
        </button>

        <div className="ens-side-card">
          <span className="ens-side-card__head">
            Документы
            <ChevronRight size={16} color="var(--color-primitive-primary)" />
          </span>
          <span className="ens-side-card__doc">
            <Circle size={18} color="var(--color-primitive-neutral-2, #d4d4d4)" /> Уведомление по ЕНП
          </span>
          <span className="ens-side-card__doc">
            <Circle size={18} color="var(--color-primitive-neutral-2, #d4d4d4)" /> Уведомление по ЕНП
          </span>
        </div>

        <button className="ens-help" onClick={() => setToast('Открываю инструкцию')}>
          <HelpCircle size={18} color="var(--color-primitive-secondary)" />
          <span className="ens-help__text">
            <span className="ens-help__title">Подробная инструкция</span>
            <span className="ens-help__desc">Как подготовить уведомление к сдаче</span>
          </span>
        </button>
      </aside>

      <div className="dest-footer">
        <button className="dest-btn dest-btn--secondary" onClick={() => done('Отмечено как сдано')}>
          Уже сдано
        </button>
        <button className="dest-btn dest-btn--primary" onClick={() => done('Уведомление отправлено')}>
          Отправить
        </button>
      </div>

      {toast && <div className="dest-toast">{toast}</div>}
    </div>
  )
}
