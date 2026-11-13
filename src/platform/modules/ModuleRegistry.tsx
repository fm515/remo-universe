import { createContext, useContext, type ReactNode } from 'react'
import type { RemoModule } from './types'

/**
 * Modules never import each other. Anything that needs the list of modules
 * (dashboard, navigation) reads it from this context, which the app shell fills in.
 */
const ModuleRegistryContext = createContext<readonly RemoModule[] | null>(null)

export function ModuleRegistryProvider({ modules, children }: { modules: readonly RemoModule[]; children: ReactNode }) {
  return <ModuleRegistryContext.Provider value={modules}>{children}</ModuleRegistryContext.Provider>
}

export function useModules(): readonly RemoModule[] {
  const modules = useContext(ModuleRegistryContext)
  if (!modules) throw new Error('useModules must be used inside <ModuleRegistryProvider>')
  return modules
}
