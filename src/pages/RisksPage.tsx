import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRiskState } from '../context/RiskStateContext'
import {
  CATEGORIES,
  CATEGORY_ORDER,
  LEARN_MORE,
  cardContent,
  headerText,
  type CategoryId,
  type Severity,
  type Task,
} from '../data/riskContent'
import RiskCard from '../components/risks/RiskCard'
import HeartPulseIcon from '../components/icons/HeartPulseIcon'
import TasksDrawer from '../components/risks/TasksDrawer'
import PulseFace from '../components/risks/PulseFace'
import './RisksPage.css'

const RANK: Record<Severity, number> = { overdue: 0, attention: 1, ok: 2 }

export default function RisksPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { levels, openTasks, entryPath } = useRiskState()
  const [drawerId, setDrawerId] = useState<CategoryId | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Если сюда вернулись «Назад» из задачи, открытой через дровер, открываем
  // дровер заново — но только если в категории ещё остались задачи.
  useEffect(() => {
    const reopenId = (location.state as { reopenDrawerId?: CategoryId } | null)?.reopenDrawerId
    if (reopenId) {
      if (openTasks[reopenId].length > 0) setDrawerId(reopenId)
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawer = drawerId ? { id: drawerId, title: CATEGORIES[drawerId].label, tasks: openTasks[drawerId] } : null

  const header = headerText(levels)

  // Рисковые категории со справочным материалом → показываем «Изучить».
  // В статусе «Серьёзно рискуете» кнопка не нужна: там все задачи решаются
  // напрямую через карточки.
  const hasLearnMore =
    header.status !== 'overdue' &&
    CATEGORY_ORDER.some((id) => levels[id] !== 'ok' && LEARN_MORE[id])

  // Промоушен: рисковые карточки всплывают наверх (overdue → attention → ok),
  // внутри группы — канонический порядок.
  const ordered = [...CATEGORY_ORDER].sort((a, b) => RANK[levels[a]] - RANK[levels[b]])

  function openTask(target: Task['target'], taskId: string, reopenDrawerId?: CategoryId) {
    const state = { taskId, ...(reopenDrawerId ? { reopenDrawerId } : {}) }
    if (target === 'tax') navigate('/risks/tax', { state })
    else if (target === 'contributions') navigate('/risks/contributions', { state })
    else if (target === 'ens') navigate('/risks/ens', { state })
    else showToast('Открываю задачу…')
  }

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 1800)
  }

  function handleCard(id: CategoryId) {
    const tasks = openTasks[id]
    // Операции без задач в риске — ведём на страницу подключения маркетплейсов.
    if (id === 'operations' && levels[id] !== 'ok' && tasks.length === 0) {
      navigate('/risks/marketplaces')
      return
    }
    if (tasks.length > 1) {
      setDrawerId(id)
    } else if (tasks.length === 1) {
      openTask(tasks[0].target, tasks[0].id)
    } else {
      showToast('Подробности скоро появятся')
    }
  }

  return (
    <div className="risks-page">
      <button className="risks-back" onClick={() => navigate(entryPath)} aria-label="Назад">
        <ArrowLeft size={20} />
      </button>

      <div className="risks-content">
        <header className="risks-header">
          <PulseFace status={header.status} size={80} />
          <h1 className="risks-header__title">{header.title}</h1>
          <p className="risks-header__subtitle">{header.subtitle}</p>
          {hasLearnMore && (
            <button
              className="risks-header__learn"
              onClick={() => showToast('Откроем условия перехода на НДС')}
            >
              Изучить
            </button>
          )}
        </header>

        <div className="risks-grid">
          {ordered.map((id) => (
            <RiskCard
              key={id}
              label={CATEGORIES[id].label}
              level={levels[id]}
              content={cardContent(CATEGORIES[id], levels[id], openTasks[id])}
              onClick={() => handleCard(id)}
            />
          ))}
        </div>

        <button className="risks-page-action" onClick={() => showToast('Что влияет на пульс')}>
          <span className="risks-page-action__icon" aria-hidden="true">
            <HeartPulseIcon size={30} />
          </span>
          <span className="risks-page-action__text">
            <span className="risks-page-action__title">Что влияет на пульс</span>
            <span className="risks-page-action__desc">Возможность снизить риски</span>
          </span>
        </button>
      </div>

      <TasksDrawer
        open={!!drawer}
        title={drawer?.title ?? ''}
        tasks={drawer?.tasks ?? []}
        severity={drawerId ? levels[drawerId] : 'ok'}
        onClose={() => setDrawerId(null)}
        onSelect={(task) => {
          openTask(task.target, task.id, drawerId ?? undefined)
        }}
      />

      {toast && <div className="risks-toast">{toast}</div>}
    </div>
  )
}
