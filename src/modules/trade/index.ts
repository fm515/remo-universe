import { lazy } from 'react'
import type { RemoModule } from '@/platform'
import { manifest } from './manifest'

export const tradeModule: RemoModule = {
  ...manifest,
  Page: lazy(() => import('./TradePage')),
}
