/**
 * Thin, failure-tolerant wrapper around localStorage.
 * Storage can be unavailable (private mode, blocked cookies, quota) — the UI must keep working.
 * All keys are namespaced `remo.<area>.v<schema>` so schemas can be migrated later.
 */
export function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
