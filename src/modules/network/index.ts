import { lazy } from 'react'
import type { RemoModule } from '@/platform'
import { manifest } from './manifest'

export const networkModule: RemoModule = {
  ...manifest,
  Page: lazy(() => import('./NetworkPage')),
}
