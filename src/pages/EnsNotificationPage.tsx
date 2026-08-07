import { useState } from 'react'
import { ArrowLeft, ChevronRight, HelpCircle, Plus } from 'lucide-react'
import PencilIcon from '../components/icons/PencilIcon'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRiskState } from '../context/RiskStateContext'
import FlowResultModal from '../components/risks/FlowResultModal'
import taxesLogo from '../logo/Taxes.png'
import documentLogo from '../logo/Document.png'
import './DestinationPage.css'

const CHECK_ITEMS = [
  { n: 1, title: 'Система налогообложения', desc: 'УСН «Доходы» — 6%' },
  { n: 2, title: 'Патенты', desc: 'добавьте, если применяли' },
  { n: 3, title: 'Операции', desc: 'на 12 874 783 ₽ облагаются налогом' },
  { n: 4, title: 'Отчёты маркетплейсов', desc: '2 отчёта с Wildberries' },
]

export default function EnsNotificationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { closeTask } = useRiskState()
  const [toast, setToast] = useState<string | null>(null)
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

  // «Готово» в результате флоу: закрываем задачу и сразу возвращаемся к рискам.
  function finishFromResult() {
    if (navState?.taskId) closeTask(navState.taskId)
    navigate('/risks', { state: backState })
  }

  return (
    <div className="dest-page dest-page--ens">
      <button className="dest-back" onClick={goBack} aria-label="Назад">
        <ArrowLeft size={20} />
      </button>

      <aside className="dest-rail">
        <p className="dest-rail__crumb">Онлайн-бухгалтерия ›</p>
        <h1 className="dest-rail__title">Уведомление по единому налоговому платежу</h1>
        <p className="dest-rail__sub">за II квартал 2025</p>
      </aside>

      <main className="ens-content">
        <header className="ens-header">
          <h2 className="ens-header__title">Проверьте и отправьте уведомление до 25 июля</h2>
          <p className="ens-header__sub">Тогда налоговая верно учтёт ваши налоги и страховые взносы</p>
        </header>

        <section className="ens-block">
          <h3 className="ens-block__title">Посмотрите данные за II квартал 2025 года</h3>
          <ul className="ens-steps">
            {CHECK_ITEMS.map((it) => (
              <li key={it.n} className="ens-step">
                <span className="ens-step__num">{it.n}</span>
                <span className="ens-step__text">
                  <span className="ens-step__title">{it.title}</span>
                  <span className="ens-step__desc">{it.desc}</span>
                </span>
                <PencilIcon size={24} className="ens-step__icon" />
              </li>
            ))}
          </ul>
        </section>

        <section className="ens-block">
          <h3 className="ens-block__title">Расскажите про деятельность вне Точка Банка</h3>
          <ul className="ens-steps">
            <li className="ens-step">
              <span className="ens-step__num">5</span>
              <span className="ens-step__text">
                <span className="ens-step__title">Доходы</span>
                <span className="ens-step__desc">
                  Загрузите выписку в формате 1С и проверьте систему налогообложения
                </span>
              </span>
              <Plus size={24} color="var(--color-primitive-brand, #835de1)" strokeWidth={2} />
            </li>
          </ul>
        </section>
      </main>

      <aside className="ens-widgets">
        <section className="ens-widget">
          <button className="ens-widget__head" onClick={() => setToast('Расчёт налогов')}>
            <span className="ens-widget__head-title">Расчёт налогов</span>
            <ChevronRight size={20} color="var(--color-primitive-primary, #191919)" />
          </button>
          <div className="ens-widget__body">
            <div className="ens-widget__cell">
              <img className="ens-widget__icon" src={taxesLogo} alt="" aria-hidden="true" />
              <span className="ens-widget__cell-text">
                <span className="ens-widget__cell-title">Налог по УСН в III кв. за 2…</span>
                <span className="ens-widget__cell-desc">56 630 ₽</span>
              </span>
            </div>
          </div>
        </section>

        <section className="ens-widget">
          <button className="ens-widget__head" onClick={() => setToast('Документы')}>
            <span className="ens-widget__head-title">Документы</span>
            <ChevronRight size={20} color="var(--color-primitive-primary, #191919)" />
          </button>
          <div className="ens-widget__body">
            <div className="ens-widget__cell">
              <img className="ens-widget__doc-icon" src={documentLogo} alt="" aria-hidden="true" />
              <span className="ens-widget__cell-title">Уведомление по ЕНП</span>
            </div>
            <div className="ens-widget__cell">
              <img className="ens-widget__doc-icon" src={documentLogo} alt="" aria-hidden="true" />
              <span className="ens-widget__cell-title">Уведомление по ЕНП</span>
            </div>
          </div>
        </section>

        <button className="ens-instruction" onClick={() => setToast('Открываю инструкцию')}>
          <HelpCircle size={30} color="var(--color-primitive-primary, #191919)" strokeWidth={1.6} />
          <span className="ens-instruction__text">
            <span className="ens-instruction__title">Подробная инструкция</span>
            <span className="ens-instruction__desc">Как подготовить уведомление к сдаче</span>
          </span>
        </button>
      </aside>

      <div className="dest-footer">
        <button className="dest-btn dest-btn--secondary" onClick={() => done('Отмечено как сдано')}>
          Уже сдано
        </button>
        <button className="dest-btn dest-btn--primary" onClick={() => setShowResult(true)}>
          Отправить
        </button>
      </div>

      {showResult && (
        <FlowResultModal title="Уведомление отправлено!" onDone={finishFromResult}>
          <p>Уведомление по единому налоговому платежу отправлено в налоговую.</p>
          <p>
            Вы можете посмотреть уведомление и его статус в разделе{' '}
            <span className="flow-result__accent">«Онлайн-бухгалтерия»</span>
          </p>
        </FlowResultModal>
      )}

      {toast && <div className="dest-toast">{toast}</div>}
    </div>
  )
}
