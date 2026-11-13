import { lazy } from 'react'
import type { RemoModule } from '@/platform'
import { manifest } from './manifest'

export const aiModule: RemoModule = {
  ...manifest,
  Page: lazy(() => import('./AiPage')),
}
