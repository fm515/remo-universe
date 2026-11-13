# Roadmap

Status of this document: **plan, not promise.** A feature is considered implemented only when it is present
in the app and its relevant tests pass.

## Stage 0 — Foundation ✅

Modular monolith, design system, AR/EN + RTL/LTR, themes, persistent preferences, installable PWA,
honest module pages, REMO LIFE task list, tests and CI.

## Stage 1 — Deploy the foundation ✅ / QA in progress

- Production PWA hosted on Vercel with HTTPS.
- CI checks type safety, module boundaries, tests and production build.
- Remaining: physical-device QA on Android Chrome / Samsung Internet and iOS Safari, Lighthouse PWA/accessibility audit, ESLint and Playwright browser tests.

## Stage 2 — Backend foundation (REMO CORE accounts + LIFE sync) — partially implemented

Implemented:
1. Dedicated Supabase project for REMO UNIVERSE.
2. Browser-safe platform adapter using the public Supabase publishable key only.
3. Email/password sign-up, sign-in, session restore and sign-out UI in Settings.
4. Per-account local storage namespaces for preferences and LIFE tasks.
5. Local-first task sync and account preference sync when online, with retry when connectivity returns.
6. RLS enabled on profiles, user_preferences and life_tasks; policies restrict authenticated users to their own rows.

Remaining:
- Real mailbox end-to-end test for email confirmation and sign-in.
- Verify sync across two real devices and test offline/conflict/deletion scenarios.
- Profile editing and account recovery/password reset UI.
- Optional Google OAuth only after its provider configuration is explicitly completed.
- Further security/performance advisor review before expanding data access.

## Stage 2A — REMO LIFE multiple reminders (in progress)

- Add an additive life_task_reminders table with owner-scoped RLS; preserve all existing tasks.
- Store each reminder as an absolute timestamp plus the IANA timezone used when it was entered.
- Support multiple reminders per task with independent create/delete operations and local-first account sync.
- Keep background push notifications separate until subscriptions, VAPID secrets, secure server delivery, scheduling, duplicate prevention and Android Chrome device tests are complete.

## Stage 3 — REMO AI
1. Server-side function that proxies a real model provider; the key never reaches the client.
2. Per-user rate limits and usage caps.
3. Chat UI with streaming; clear labelling of the model in use.

## Stage 4 — REMO STORE
1. Read-only catalogue from the database, seller onboarding.
2. Checkout through a licensed payment provider's hosted flow; webhooks verified server-side. Requires a registered business entity and provider approval.

## Stage 5 — REMO TRADE
1. Read-only market data from a named provider (respecting its licence and rate limits), with timestamps.
2. Watchlists, charts, indicators.
3. Order execution only through a licensed broker and only after legal review — possibly never in some jurisdictions.

## Stage 6 — REMO WALLET
1. View-only connection to a user-owned wallet (non-custodial; REMO never holds keys).
2. Balances and history read from public chain data, with source and time shown.

## Stage 7 — REMO utility token (later phase)
Not started and **not deployed**. Prerequisites: defined in-platform utility, legal review per target jurisdiction, audited contract, testnet period. No token-related code should land before these.

## When to split the monolith
Stay a modular monolith until a module needs a different runtime or scaling profile, compliance isolation, or independent release cycles.
The boundary rules in docs/ARCHITECTURE.md exist so this split is cheap when the time comes.