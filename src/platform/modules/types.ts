import type { LucideIcon } from 'lucide-react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { Localized } from '../i18n'

export const MODULE_IDS = ['core', 'ai', 'trade', 'wallet', 'store', 'life', 'network'] as const
export type ModuleId = (typeof MODULE_IDS)[number]

/**
 * implemented — works in this build, end to end, with real behaviour.
 * planned     — does not exist yet. The UI must never imitate it.
 */
export type FeatureStatus = 'implemented' | 'planned'

/** Derived from features — never declared by hand (see deriveStatus). */
export type ModuleStatus = 'active' | 'partial' | 'planned'

export interface ModuleFeature {
  id: string
  status: FeatureStatus
  title: Localized<string>
  description: Localized<string>
}

/** Static, serialisable description of a module. */
export interface ModuleManifest {
  id: ModuleId
  /** Brand name — intentionally not translated. */
  name: string
  /** Absolute in-app route, e.g. "/wallet". */
  path: string
  icon: LucideIcon
  tagline: Localized<string>
  description: Localized<string>
  /** Plain statement of what this module does NOT do yet. Required for planned modules. */
  notice?: Localized<string>
  features: ModuleFeature[]
}

type PageComponent = LazyExoticComponent<ComponentType>

/** A manifest plus its lazily loaded UI. This is the only thing the app shell knows about a module. */
export interface RemoModule extends ModuleManifest {
  Page: PageComponent
  extraRoutes?: { path: string; Page: PageComponent }[]
}

export function deriveStatus(features: readonly ModuleFeature[]): ModuleStatus {
  const implemented = features.filter((f) => f.status === 'implemented').length
  if (implemented === 0) return 'planned'
  return implemented === features.length ? 'active' : 'partial'
}

export function countFeatures(modules: readonly ModuleManifest[]): Record<FeatureStatus, number> {
  const counts = { implemented: 0, planned: 0 }
  for (const module of modules) for (const feature of module.features) counts[feature.status] += 1
  return counts
}
