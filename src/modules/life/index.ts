import { lazy } from 'react'
import type { RemoModule } from '@/platform'
import { manifest } from './manifest'

export const lifeModule: RemoModule = {
  ...manifest,
  Page: lazy(() => import('./LifePage')),
}
