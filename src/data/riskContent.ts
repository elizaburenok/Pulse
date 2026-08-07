// Модель рисков — посегментная. У каждой из 5 категорий свой уровень:
// ok (серый) / attention (жёлтый) / overdue (красный). Статус страницы —
// агрегат по принципу ИЛИ. Контент собран по макетам Figma.

export type Severity = 'ok' | 'attention' | 'overdue'
export type CategoryId = 'taxes' | 'reporting' | 'operations' | 'limit' | 'patent'

/** Куда ведёт задача при выполнении. null — заглушка/тост. */
export type TaskTarget = 'tax' | 'contributions' | 'ens' | null

/** Логотип задачи в дровере — из src/logo. Без иконки — нейтральный кружок. */
export type TaskIcon = 'taxes' | 'contributions'

export interface Task {
  id: string
  title: string
  /** «25 июля» — без предлога, чтобы собирать и «до …», и «Срок вышел …». */
  date: string
  target: TaskTarget
  icon?: TaskIcon
}

export interface CardContent {
  /** Крупная строка карточки. */
  title: string
  /** Подпись под ней. Для overdue — акцент «Срок вышел …». */
  subtitle: string
}

export interface CategoryDef {
  id: CategoryId
  label: string
  /** Тексты карточки по каждому уровню. */
  content: Record<Severity, CardContent>
}

/** Канонический порядок категорий (как в базовом макете). */
export const CATEGORY_ORDER: CategoryId[] = [
  'reporting',
  'taxes',
  'operations',
  'limit',
  'patent',
]

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  taxes: {
    id: 'taxes',
    label: 'Налоги и взносы',
    content: {
      ok: { title: 'Всё уплачено', subtitle: 'Проблем нет' },
      attention: { title: 'Налог по УСН за II кв.', subtitle: 'До 28 июля' },
      overdue: { title: 'Налог по УСН за II кв.', subtitle: 'Срок вышел 28 июля' },
    },
  },
  reporting: {
    id: 'reporting',
    label: 'Отчётность',
    content: {
      ok: { title: 'Всё сдано', subtitle: 'Проблем нет' },
      attention: { title: 'Уведомление по ЕНП', subtitle: 'До 25 июля' },
      overdue: { title: 'Уведомление по ЕНП', subtitle: 'Срок вышел 25 июля' },
    },
  },
  operations: {
    id: 'operations',
    label: 'Операции',
    content: {
      ok: { title: 'Всё учтено', subtitle: 'Проблем нет' },
      attention: { title: 'Платёж по ЕНС', subtitle: 'Уточните' },
      overdue: { title: 'Платёж по ЕНС', subtitle: 'Уточните' },
    },
  },
  limit: {
    id: 'limit',
    label: 'Лимит на доход',
    content: {
      ok: { title: 'Доход в норме', subtitle: '10 000 000 ₽' },
      attention: { title: 'Почти лимит', subtitle: '18 000 000 ₽' },
      overdue: { title: 'Лимит достигнут', subtitle: '20 000 000 ₽' },
    },
  },
  patent: {
    id: 'patent',
    label: 'Патенты',
    content: {
      ok: { title: '1/3 оплачена', subtitle: '25 апреля' },
      attention: { title: 'Налог по патенту', subtitle: 'До 20 августа' },
      overdue: { title: 'Налог по патенту', subtitle: 'Срок вышел 20 августа' },
    },
  },
}

/** «1 платёж» / «2 платежа» / «5 платежей». */
function pluralPayments(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} платёж`
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${n} платежа`
  return `${n} платежей`
}

/**
 * Контент карточки категории. Если рисковых задач больше одной, карточка не
 * называет конкретную задачу — показывает их число и ближайший срок
 * (node 40000964-61010), иначе — статический текст из CATEGORIES.
 */
export function cardContent(category: CategoryDef, severity: Severity, tasks: Task[]): CardContent {
  if (severity !== 'ok' && tasks.length > 1) {
    const nearest = tasks[0]
    return {
      title: pluralPayments(tasks.length),
      subtitle: severity === 'overdue' ? `Срок вышел ${nearest.date}` : `До ${nearest.date}`,
    }
  }
  return category.content[severity]
}

/** Категории, для которых есть справочный материал → показываем «Изучить». */
export const LEARN_MORE: Partial<Record<CategoryId, string>> = {
  limit: 'Условия перехода на НДС',
}

// ─── Шапка страницы ──────────────────────────────────────────────────────────

export type PageStatus = 'ok' | 'attention' | 'overdue'

const STATUS_TITLE: Record<PageStatus, string> = {
  ok: 'Всё в порядке',
  attention: 'Обратите внимание',
  overdue: 'Серьёзно рискуете',
}

/** Подзаголовок под конкретный активный риск (attention / overdue). */
const CATEGORY_SUBTITLE: Record<CategoryId, Record<'attention' | 'overdue', string>> = {
  taxes: {
    attention: 'У вас есть налоги и взносы к уплате. Не откладывайте, чтобы не получить штраф.',
    overdue: 'Уплатите налог и взносы как можно скорее, чтобы избежать блокировки',
  },
  reporting: {
    attention: 'У вас есть отчётность к сдаче. Не откладывайте, чтобы не получить штраф.',
    overdue: 'Сдайте отчётность как можно скорее, чтобы избежать блокировки',
  },
  operations: {
    attention: 'У вас есть неопределённые операции. Уточните, чтобы не получить штраф',
    overdue: 'Уточните операции как можно скорее, чтобы избежать штрафа',
  },
  limit: {
    attention:
      'Ваш доход почти достиг лимита. Изучите условия перехода на НДС, чтобы подготовиться заранее',
    overdue: 'Вы достигли лимита по доходу, изучите условия перехода на НДС',
  },
  patent: {
    attention: 'У вас есть налог по патенту к уплате. Не откладывайте, чтобы не получить штраф.',
    overdue: 'Уплатите налог по патенту как можно скорее, чтобы избежать блокировки',
  },
}

const OK_SUBTITLE =
  'Налоги уплачены, отчётность сдана. Чувствуете? Даже дышится свободнее.'
const MULTI_ATTENTION = 'Есть вопросы в нескольких разделах — решите их, чтобы не получить пени'
const MULTI_OVERDUE = 'Несколько вопросов требуют срочного решения — иначе счёт заблокируют'

export interface HeaderText {
  status: PageStatus
  title: string
  subtitle: string
}

/** Уровни по категориям → агрегат-статус (принцип ИЛИ). */
export function aggregateStatus(levels: Record<CategoryId, Severity>): PageStatus {
  const values = Object.values(levels)
  if (values.includes('overdue')) return 'overdue'
  if (values.includes('attention')) return 'attention'
  return 'ok'
}

/** Текст шапки: заголовок по агрегату, подзаголовок — по активному риску. */
export function headerText(levels: Record<CategoryId, Severity>): HeaderText {
  const status = aggregateStatus(levels)
  if (status === 'ok') {
    return { status, title: STATUS_TITLE.ok, subtitle: OK_SUBTITLE }
  }
  const risky = CATEGORY_ORDER.filter((id) => levels[id] !== 'ok')
  let subtitle: string
  if (risky.length === 1) {
    const id = risky[0]
    const tone = levels[id] === 'overdue' ? 'overdue' : 'attention'
    subtitle = CATEGORY_SUBTITLE[id][tone]
  } else {
    subtitle = status === 'overdue' ? MULTI_OVERDUE : MULTI_ATTENTION
  }
  return { status, title: STATUS_TITLE[status], subtitle }
}

/** Активная категория, если риск ровно один (для кнопки «Изучить»). */
export function soleRiskyCategory(
  levels: Record<CategoryId, Severity>,
): CategoryId | null {
  const risky = CATEGORY_ORDER.filter((id) => levels[id] !== 'ok')
  return risky.length === 1 ? risky[0] : null
}
