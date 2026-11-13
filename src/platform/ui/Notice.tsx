import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocalize } from '../preferences'
import { common } from './strings'

export function Notice({ children }: { children: ReactNode }) {
  const localize = useLocalize()
  return (
    <div className="notice" role="note">
      <Info size={18} aria-hidden />
      <p>
        <strong>{localize(common.noticeLabel)}: </strong>
        {children}
      </p>
    </div>
  )
}
