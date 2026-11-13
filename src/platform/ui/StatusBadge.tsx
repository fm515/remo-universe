import { Check, CircleDashed, CircleDot } from 'lucide-react'
import type { FeatureStatus, ModuleStatus } from '../modules'
import { useLocalize } from '../preferences'
import { statusLabel } from './strings'

const ICONS = { active: Check, implemented: Check, partial: CircleDot, planned: CircleDashed }

/** Status is always conveyed by icon + text, never by colour alone. */
export function StatusBadge({ status }: { status: ModuleStatus | FeatureStatus }) {
  const localize = useLocalize()
  const Icon = ICONS[status]
  return (
    <span className={`badge badge--${status}`}>
      <Icon size={13} strokeWidth={2.5} aria-hidden />
      {localize(statusLabel[status])}
    </span>
  )
}
