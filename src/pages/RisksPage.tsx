import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  const { scenario, levels } = useRiskState()
  const [drawer, setDrawer] = useState<{ title: string; tasks: Task[] } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const header = headerText(levels)

  // Рисковые категории со справочным материалом → показываем «Изучить».
  // В статусе «Есть проблемы» кнопка не нужна: там все задачи решаются
  // напрямую через карточки.
  const hasLearnMore =
    header.status !== 'overdue' &&
    CATEGORY_ORDER.some((id) => levels[id] !== 'ok' && LEARN_MORE[id])

  // Промоушен: рисковые карточки всплывают наверх (overdue → attention → ok),
  // внутри группы — канонический порядок.
  const ordered = [...CATEGORY_ORDER].sort((a, b) => RANK[levels[a]] - RANK[levels[b]])

  function openTask(target: Task['target']) {
    if (target === 'tax') navigate('/risks/tax')
    else if (target === 'ens') navigate('/risks/ens')
    else showToast('Открываю задачу…')
  }

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 1800)
  }

  function handleCard(id: CategoryId) {
    const tasks = scenario.levels[id].tasks
    if (tasks.length > 1) {
      setDrawer({ title: CATEGORIES[id].label, tasks })
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
        onClose={() => setDrawer(null)}
        onSelect={(task) => {
          setDrawer(null)
          openTask(task.target)
        }}
      />

      {toast && <div className="risks-toast">{toast}</div>}
    </div>
  )
}
