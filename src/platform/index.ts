/**
 * REMO platform kernel — the ONLY thing a module may import besides its own files and npm packages.
 * Keep this surface small and stable; every export here is a contract with all seven modules.
 */
export * from './i18n'
export * from './modules'
export * from './preferences'
export * from './pwa'
export * from './routes'
export * from './storage'
export * from './ui'
export * from './backend'
