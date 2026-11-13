# REMO UNIVERSE

**Global modular digital ecosystem — foundation build `v0.3.0`.**
منظومة رقمية عالمية من وحدات مستقلة — مرحلة الحسابات والمزامنة السحابية.

A mobile-first, installable PWA (React + Vite + TypeScript) in Arabic (RTL) and English (LTR), built as a
**modular monolith** of seven independent modules.

> **Honesty rule.** Account authentication, account-scoped preferences and REMO LIFE task sync are implemented
> with the dedicated Supabase project. AI, trading, wallet balances, store listings, payments and the REMO token
> are not live features. No fake balances, prices, products or transactions are shown. REMO COIN is not deployed.

## What works today

| Module | Status | Working now |
| --- | --- | --- |
| REMO CORE | Partly working | Dashboard, module registry + navigation, AR/EN with RTL/LTR, dark/light/system theme, guest-local preferences, email/password accounts, account preference sync, installable offline-capable PWA |
| REMO LIFE | Partly working | Add / complete / delete tasks; local-first storage; account task sync when online; guest tasks remain device-only |
| REMO AI | Planned | — |
| REMO TRADE | Planned | — |
| REMO WALLET | Planned | — |
| REMO STORE | Planned | — |
| REMO NETWORK | Planned | — |

Cloud sync requires a signed-in account and an internet connection. The app continues to work locally when offline.
Email confirmation may be required depending on the Supabase Auth project setting. Full email-delivery and
multi-device end-to-end QA still remain.

## Setup

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for local cloud features.
npm run dev        # development server (http://localhost:5173)
npm run verify     # type-check + module boundaries + tests + production build
npm run preview    # serve the production build (service worker active)
```

Only the public Supabase publishable key belongs in `VITE_` variables. Never place a service-role or secret key
in browser code or in a `VITE_` variable. The database tables are protected by row-level security policies
that scope each user's rows to their authenticated user ID.

| Script | Purpose |
| --- | --- |
| `npm run typecheck` | Strict TypeScript check |
| `npm run check:boundaries` | Fails if a module imports another module or platform internals |
| `npm test` | Unit tests + jsdom smoke test of the whole app |
| `npm run build` | Production build into `dist/` (includes manifest + service worker) |

## Deploying

The production PWA is hosted on Vercel: https://remo-universe.vercel.app.
The Supabase project is separate and dedicated to REMO UNIVERSE. Vercel has the public URL and publishable key
configured for Production, Preview and Development.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — structure, module contract, design system, i18n, PWA
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — completed work, next development stages and known gaps

## Repository history note

The repository originally held the foundation as `remo-universe-foundation-v0.1.0(1).zip` plus a one-off
workflow to extract it. The archive was extracted into the repository root and both were removed; the
original files remain available in Git history.
