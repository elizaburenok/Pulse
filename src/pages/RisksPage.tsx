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
import TasksDrawer from '../components/risks/TasksDrawer'
import PulseFace from '../components/risks/PulseFace'
import './RisksPage.css'

const RANK: Record<Severity, number> = { overdue: 0, attention: 1, ok: 2 }

export default function RisksPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { scenario, levels } = useRiskState()
  const [drawerId, setDrawerId] = useState<CategoryId | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Если сюда вернулись «Назад» из задачи, открытой через дровер,
  // открываем дровер заново вместо голой страницы рисков.
  useEffect(() => {
    const reopenId = (location.state as { reopenDrawerId?: CategoryId } | null)?.reopenDrawerId
    if (reopenId) {
      setDrawerId(reopenId)
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawer = drawerId ? { id: drawerId, title: CATEGORIES[drawerId].label, tasks: scenario.levels[drawerId].tasks } : null

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

  function openTask(target: Task['target'], reopenDrawerId?: CategoryId) {
    const state = reopenDrawerId ? { reopenDrawerId } : undefined
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
    const tasks = scenario.levels[id].tasks
    if (tasks.length > 1) {
      setDrawerId(id)
    } else if (tasks.length === 1) {
      openTask(tasks[0].target)
    } else {
      showToast('Подробности скоро появятся')
    }
  }

  return (
    <div className="risks-page">
      <button className="risks-back" onClick={() => navigate('/')} aria-label="Назад">
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
              content={cardContent(CATEGORIES[id], levels[id], scenario.levels[id].tasks)}
              onClick={() => handleCard(id)}
            />
          ))}
        </div>

        <button className="risks-page-action" onClick={() => showToast('Что влияет на пульс')}>
          <span className="risks-page-action__icon" aria-hidden="true">
            ♡
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
        onClose={() => setDrawerId(null)}
        onSelect={(task) => {
          openTask(task.target, drawerId ?? undefined)
        }}
      />

      {toast && <div className="risks-toast">{toast}</div>}
    </div>
  )
}
