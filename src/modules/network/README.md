# REMO NETWORK

Independent module of the REMO UNIVERSE modular monolith.

- `manifest.ts` — the single source of truth for this module: identity, route, and every
  feature with its status (`implemented` or `planned`). The UI is generated from it.
- `index.ts` — the only export the app consumes (`RemoModule`, lazily loaded page).

Rules: import only this folder's files, `@/platform`, and npm packages — never another module.
A feature is switched to `implemented` only when it really works end to end.
See `docs/ARCHITECTURE.md`.
