import type { PageStatus } from '../../data/riskContent'
import okIcon from '../../logo/Avatar.png'
import attentionIcon from '../../logo/Avatar-1.png'
import overdueIcon from '../../logo/Avatar-2.png'

interface Props {
  status: PageStatus
  size?: number
}

const ICON: Record<PageStatus, string> = {
  ok: okIcon,
  attention: attentionIcon,
  overdue: overdueIcon,
}

/** Иконка-смайл «Пульс» по статусу — из src/logo. */
export default function PulseFace({ status, size = 64 }: Props) {
  return (
    <img
      src={ICON[status]}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  )
}
