# Roadmap

Status of this document: **plan, not promise.** Nothing below exists until it is marked implemented in the
relevant module `manifest.ts`.

## Stage 0 — Foundation ✅ (this build, v0.2.0)

Modular monolith, design system, AR/EN + RTL/LTR, themes, persistent preferences, installable PWA,
honest module pages, REMO LIFE task list, tests, CI.

## Known gaps in the foundation

- **Not verified on physical devices.** Verified by type-check, automated tests (including a jsdom smoke
  test of the whole app) and production build. Layout, install flow and offline behaviour still need a
  manual pass on real Android Chrome / Samsung Internet and on iOS Safari.
- **Not deployed.** No hosting is configured yet.
- **No ESLint / Prettier** configuration yet.
- **No Arabic web font.** The system font is used; a self-hosted Arabic typeface is a design decision
  still to be made (costs download size).
- **No end-to-end browser tests** (Playwright) and no automated accessibility audit.
- **Task list is device-only**: no backup, no sync, no due dates.

## Stage 1 — Ship the foundation

1. Deploy `dist/` to a free static host with HTTPS; add a deploy job to CI.
2. Real-device QA (Android first), Lighthouse PWA + accessibility audit, fix findings.
3. Add ESLint (incl. `jsx-a11y`) and Playwright smoke tests.

## Stage 2 — Backend foundation (REMO NETWORK + CORE accounts)

One managed backend on a free tier (e.g. Supabase: Postgres, Auth, Row Level Security, Edge Functions).

1. Add a `platform/backend` adapter — modules never talk to the vendor SDK directly.
2. Email / OAuth sign-in; profile table with RLS.
3. Sync preferences and REMO LIFE tasks (local-first, then cloud).
4. Only the public anon key is shipped to the client; every table is protected by RLS.

## Stage 3 — REMO AI

1. Server-side function that proxies a real model provider; the key never reaches the client.
2. Per-user rate limits and usage caps (needs Stage 2 accounts).
3. Chat UI with streaming; clear labelling of the model in use.

## Stage 4 — REMO STORE

1. Read-only catalogue from the database, seller onboarding.
2. Checkout through a licensed payment provider's hosted flow; webhooks verified server-side.
   Requires a registered business entity and the provider's approval.

## Stage 5 — REMO TRADE

1. Read-only market data from a named provider (respecting its licence and rate limits), with timestamps.
2. Watchlists, charts, indicators.
3. Order execution only through a licensed broker and only after legal review — possibly never in some
   jurisdictions.

## Stage 6 — REMO WALLET

1. View-only connection to a user-owned wallet (non-custodial; REMO never holds keys).
2. Balances and history read from public chain data, with source and time shown.

## Stage 7 — REMO utility token (later phase)

Not started and **not deployed**. Prerequisites: defined in-platform utility, legal review per target
jurisdiction, audited contract, testnet period. No token-related code should land before these.

## When to split the monolith

Stay a modular monolith until at least one of these is true:

- a module needs a different runtime or scaling profile (e.g. long-running market-data ingestion);
- a module needs isolation for compliance (payments, custody);
- separate teams need independent release cycles.

The boundary rules in `docs/ARCHITECTURE.md` exist so that this split is cheap when the time comes.
