import { lazy } from 'react'
import { ROUTES, type RemoModule } from '@/platform'
import { manifest } from './manifest'

/** CORE owns the platform-level screens: dashboard, module list and settings. */
export const coreModule: RemoModule = {
  ...manifest,
  Page: lazy(() => import('./CorePage')),
  extraRoutes: [
    { path: ROUTES.home, Page: lazy(() => import('./DashboardPage')) },
    { path: ROUTES.modules, Page: lazy(() => import('./ModulesPage')) },
    { path: ROUTES.settings, Page: lazy(() => import('./SettingsPage')) },
  ],
}
