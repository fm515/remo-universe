import { useSyncExternalStore } from 'react'
import { registerSW } from 'virtual:pwa-register'

/** Chromium-only event (Android Chrome, Edge, Samsung Internet). Not in lib.dom. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface PwaState {
  /** The service worker has cached the app shell; it opens without a connection. */
  offlineReady: boolean
  /** A newer build is downloaded and waiting for a reload. */
  updateAvailable: boolean
  /** The browser offered an install prompt we can trigger. */
  canInstall: boolean
  /** Running as an installed app (standalone window). */
  installed: boolean
}

let state: PwaState = { offlineReady: false, updateAvailable: false, canInstall: false, installed: false }
const listeners = new Set<() => void>()
let installEvent: BeforeInstallPromptEvent | null = null
let applyUpdate: ((reload?: boolean) => Promise<void>) | null = null

function set(patch: Partial<PwaState>) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

/** Call once at startup. Registers the service worker (production builds only) and install hooks. */
export function initPwa() {
  const standalone = window.matchMedia('(display-mode: standalone)')
  set({ installed: standalone.matches })
  standalone.addEventListener('change', () => set({ installed: standalone.matches }))

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installEvent = event as BeforeInstallPromptEvent
    set({ canInstall: true })
  })
  window.addEventListener('appinstalled', () => {
    installEvent = null
    set({ canInstall: false, installed: true })
  })

  if ('serviceWorker' in navigator) {
    // Already controlled by a worker from a previous visit ⇒ the shell is cached.
    if (navigator.serviceWorker.controller) set({ offlineReady: true })
    applyUpdate = registerSW({
      onOfflineReady: () => set({ offlineReady: true }),
      onNeedRefresh: () => set({ updateAvailable: true }),
    })
  }
}

export async function promptInstall(): Promise<void> {
  if (!installEvent) return
  const event = installEvent
  installEvent = null
  set({ canInstall: false })
  await event.prompt()
  await event.userChoice
}

export function reloadToUpdate(): void {
  void applyUpdate?.(true)
}

export function dismissUpdate(): void {
  set({ updateAvailable: false })
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function usePwa(): PwaState {
  return useSyncExternalStore(subscribe, () => state)
}

const subscribeOnline = (listener: () => void) => {
  window.addEventListener('online', listener)
  window.addEventListener('offline', listener)
  return () => {
    window.removeEventListener('online', listener)
    window.removeEventListener('offline', listener)
  }
}

/** Whether the browser reports a network connection (navigator.onLine). */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine)
}
