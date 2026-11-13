#!/usr/bin/env node
/**
 * Enforces the modular-monolith dependency rules (docs/ARCHITECTURE.md):
 *
 *   src/app       → may import platform and modules
 *   src/modules/x → may import ONLY its own files, `@/platform` (the public barrel) and npm packages
 *   src/platform  → may import ONLY platform files and npm packages
 *
 * Run with `npm run check:boundaries`. Exits 1 on any violation.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const src = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src')
const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : []
  })
}

/** Returns the import target as a path relative to src/ (posix), or null for npm packages. */
function target(file, specifier) {
  if (specifier.startsWith('@/')) return specifier.slice(2)
  if (specifier.startsWith('.')) return relative(src, resolve(dirname(file), specifier)).split(sep).join('/')
  return null
}

const violations = []
for (const file of walk(src)) {
  const rel = relative(src, file).split(sep).join('/')
  const [area, moduleId] = rel.split('/')
  for (const [, specifier] of readFileSync(file, 'utf8').matchAll(IMPORT)) {
    const to = target(file, specifier)
    if (to === null) continue
    let problem = null
    if (area === 'modules') {
      const own = `modules/${moduleId}`
      if (to === own || to.startsWith(`${own}/`)) continue
      if (to !== 'platform') {
        problem = to.startsWith('platform/')
          ? "import from '@/platform' (the public barrel), not from platform internals"
          : to.startsWith('modules/')
            ? 'a module must not import another module'
            : 'a module may only import its own files and @/platform'
      }
    } else if (area === 'platform') {
      if (!(to === 'platform' || to.startsWith('platform/'))) problem = 'platform must not depend on app or modules'
    }
    if (problem) violations.push(`src/${rel}\n    imports '${specifier}' — ${problem}`)
  }
}

if (violations.length > 0) {
  console.error(`Module boundary violations (${violations.length}):\n\n${violations.join('\n\n')}\n`)
  process.exit(1)
}
console.log('Module boundaries OK')
