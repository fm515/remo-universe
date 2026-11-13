import { useCallback, useEffect, useState } from 'react'
import { readJson, writeJson } from './storage'

/**
 * State persisted in localStorage on this device.
 * `parse` must accept ANY input (missing, corrupt, outdated) and return a valid value.
 * Changes made in another tab are picked up through the `storage` event.
 */
export function usePersistentState<T>(
  key: string,
  parse: (raw: unknown) => T,
): [T, (update: (previous: T) => T) => void] {
  const [value, setValue] = useState<T>(() => parse(readJson(key)))

  useEffect(() => {
    writeJson(key, value)
  }, [key, value])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) setValue(parse(readJson(key)))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // `parse` is expected to be a stable module-level function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = useCallback((updater: (previous: T) => T) => setValue(updater), [])
  return [value, update]
}
