import type { RemoModule } from '@/platform'
import { aiModule } from '@/modules/ai'
import { coreModule } from '@/modules/core'
import { lifeModule } from '@/modules/life'
import { networkModule } from '@/modules/network'
import { storeModule } from '@/modules/store'
import { tradeModule } from '@/modules/trade'
import { walletModule } from '@/modules/wallet'

/**
 * Composition root: the single place where modules are wired into the app.
 * To add a module: create src/modules/<id>/, export a RemoModule, add it here.
 * Order here is the order shown in navigation and on the dashboard.
 */
export const modules: readonly RemoModule[] = [
  coreModule,
  aiModule,
  tradeModule,
  walletModule,
  storeModule,
  lifeModule,
  networkModule,
]
