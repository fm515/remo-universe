import { lazy } from 'react'
import type { RemoModule } from '@/platform'
import { manifest } from './manifest'

export const walletModule: RemoModule = {
  ...manifest,
  Page: lazy(() => import('./WalletPage')),
}
