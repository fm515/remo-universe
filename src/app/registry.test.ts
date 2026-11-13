import { describe, expect, it } from 'vitest'
import { LANGUAGES, MODULE_IDS, countFeatures, deriveStatus } from '@/platform'
import { modules } from './registry'

/** Guards the honesty rules of the foundation: what is not built must say so. */
describe('module registry', () => {
  it('registers exactly the seven REMO modules, once each', () => {
    expect(modules.map((m) => m.id).sort()).toEqual([...MODULE_IDS].sort())
  })

  it('has unique routes', () => {
    const paths = modules.flatMap((m) => [m.path, ...(m.extraRoutes ?? []).map((r) => r.path)])
    expect(new Set(paths).size).toBe(paths.length)
    for (const path of paths) expect(path.startsWith('/')).toBe(true)
  })

  it('has complete Arabic and English text everywhere', () => {
    for (const module of modules) {
      const texts = [module.tagline, module.description, ...(module.notice ? [module.notice] : [])]
      for (const feature of module.features) texts.push(feature.title, feature.description)
      for (const text of texts) for (const language of LANGUAGES) expect(text[language].trim()).not.toBe('')
      expect(new Set(module.features.map((f) => f.id)).size).toBe(module.features.length)
    }
  })

  it('keeps AI, TRADE, WALLET, STORE and NETWORK honestly planned, with a notice', () => {
    for (const id of ['ai', 'trade', 'wallet', 'store', 'network']) {
      const module = modules.find((m) => m.id === id)!
      expect(deriveStatus(module.features)).toBe('planned')
      expect(module.notice).toBeDefined()
    }
  })

  it('derives status and totals from features', () => {
    expect(deriveStatus(modules.find((m) => m.id === 'life')!.features)).toBe('partial')
    const counts = countFeatures(modules)
    expect(counts.implemented + counts.planned).toBe(modules.reduce((n, m) => n + m.features.length, 0))
  })
})
