# REMO UNIVERSE

**Global modular digital ecosystem — foundation build `v0.2.0`.**
منظومة رقمية عالمية من وحدات مستقلة — النسخة التأسيسية.

A mobile-first, installable PWA (React + Vite + TypeScript) in Arabic (RTL) and English (LTR), built as a
**modular monolith** of seven independent modules.

> **Honesty rule.** This build contains no simulated AI, no fake balances, prices, products or payments,
> no backend and no secrets. Anything not built yet is labelled **Planned** in the app itself.
> The REMO token is **not deployed**; it is a utility token planned for a later phase.

## What works today

| Module | Status | Working now |
| --- | --- | --- |
| REMO CORE | Partly working | Dashboard, module registry + navigation, AR/EN with RTL/LTR, dark/light/system theme, saved preferences, installable offline-capable PWA |
| REMO LIFE | Partly working | Task list (add / complete / delete), stored on the device, works offline |
| REMO AI | Planned | — |
| REMO TRADE | Planned | — |
| REMO WALLET | Planned | — |
| REMO STORE | Planned | — |
| REMO NETWORK | Planned | — |

The same information is shown in the app and is generated from each module's `manifest.ts`, so the UI and
the code cannot disagree.

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev        # development server (http://localhost:5173)
npm run verify     # type-check + module boundaries + tests + production build
npm run preview    # serve the production build (service worker active)
```

| Script | Purpose |
| --- | --- |
| `npm run typecheck` | Strict TypeScript check |
| `npm run check:boundaries` | Fails if a module imports another module or platform internals |
| `npm test` | Unit tests + jsdom smoke test of the whole app |
| `npm run build` | Production build into `dist/` (includes manifest + service worker) |

No environment variables are needed. See `.env.example` for the rules that apply once a backend exists.

## Deploying (free tier)

`dist/` is a fully static site. It uses a relative base path and hash routing, so it runs unchanged on
GitHub Pages, Cloudflare Pages, Netlify or Vercel — including under a sub-path — with no rewrite rules.
PWA install and offline support require HTTPS (all of those hosts provide it).

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — structure, module contract, design system, i18n, PWA
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — next development stages and what remains incomplete

## Repository history note

The repository originally held the foundation as `remo-universe-foundation-v0.1.0(1).zip` plus a one-off
workflow to extract it. The archive was extracted into the repository root and both were removed; the
original files remain available in Git history.
