# Architecture

REMO UNIVERSE is a **modular monolith**: one deployable front-end application, internally divided into
modules with enforced boundaries. There are no microservices and, in this build, no backend at all.

## Layout

```
src/
├── main.tsx                 entry: styles, service-worker registration, <App/>
├── app/                     COMPOSITION ROOT — the only layer that knows every module
│   ├── registry.ts          list of modules (order = navigation order)
│   ├── App.tsx              providers + routes generated from the registry
│   ├── AppShell.tsx         sidebar / top bar / bottom tabs, offline banner, update toast
│   └── shell.css
├── platform/                SHARED KERNEL — public API is src/platform/index.ts
│   ├── i18n/                languages, direction, Localized<T>
│   ├── preferences/         language + theme state, persistence, document sync
│   ├── storage/             safe localStorage wrapper, usePersistentState
│   ├── modules/             module contract (types), registry context, status derivation
│   ├── pwa/                 install prompt, offline/update state, online status
│   ├── ui/                  shared components (ModulePage, StatusBadge, Notice, Segmented)
│   └── styles/              design tokens, base, components
└── modules/
    ├── core/                dashboard, module list, settings
    ├── life/                task list (implemented)
    └── ai/ trade/ wallet/ store/ network/     planned — manifest only
```

## Dependency rules

```
app  ──▶  modules  ──▶  platform  ──▶  npm packages
 └────────────────────────▲
```

1. A module imports only its own files, `@/platform` (the barrel) and npm packages.
2. A module never imports another module. Shared needs go through `platform`.
3. `platform` never imports `app` or `modules`.
4. Only `app/registry.ts` wires modules in.

These rules are enforced by `npm run check:boundaries` (`scripts/check-boundaries.mjs`) and run in CI.
Modules that need the list of modules (the dashboard) read it from `useModules()`, which the app fills in —
so even REMO CORE does not import its siblings.

**Why this matters later:** because modules only touch the platform API, any module can be moved into its
own package, or backed by its own service, without rewriting the others. Do not split anything until there
is a concrete reason (see the roadmap).

## The module contract

Every module exports one `RemoModule` (`src/platform/modules/types.ts`):

| Field | Meaning |
| --- | --- |
| `id`, `name`, `path`, `icon` | identity and route |
| `tagline`, `description` | `Localized<string>` — Arabic and English are both required by the type system |
| `notice` | plain statement of what the module does **not** do yet (required for planned modules) |
| `features[]` | each with `status: 'implemented' \| 'planned'` |
| `Page`, `extraRoutes` | lazily loaded UI — each module is its own JS chunk |

### Implemented vs planned

- A feature is `implemented` only if it works end to end with real behaviour.
- Module status (**Working / Partly working / Planned**) is *derived* from its features by `deriveStatus()`;
  it cannot be set by hand.
- Dashboard counters are computed from the manifests.
- Planned modules render `ModulePage` only: description, notice and the planned list. No mock screens,
  sample data, or disabled look-alike controls.
- `src/app/registry.test.ts` fails if AI, TRADE, WALLET, STORE or NETWORK gains an "implemented" feature
  without that test being consciously updated, or loses its notice.

### Adding or growing a module

1. Build the feature inside `src/modules/<id>/` (pure logic in its own file with tests, like `life/tasks.ts`).
2. Flip the feature's status to `implemented` in `manifest.ts` — the UI updates everywhere.
3. A brand-new module: create the folder, export a `RemoModule`, add it to `app/registry.ts` and to
   `MODULE_IDS`.

## Internationalisation

- Languages: `ar` (RTL, default fallback) and `en` (LTR). First visit uses the browser language.
- Text is co-located with the code that uses it as `Localized<string>` objects (`{ ar, en }`);
  `useLocalize()` picks the current one. A missing translation is a compile error.
- `<html lang dir>` is the single source of direction. CSS uses logical properties
  (`margin-inline-start`, `border-inline-end`, `inset-inline`) so there is no separate RTL stylesheet.
  Directional icons carry `.flip-rtl`. Brand names stay LTR via `dir="ltr"`; user text uses `dir="auto"`.
- Adding a language: add it to `LANGUAGES` and `LANGUAGE_META`; TypeScript then lists every string to
  translate.

## Design system

Black · electric yellow `#FFE600` · white, defined once in `platform/styles/tokens.css`.

- Components use semantic variables (`--bg`, `--surface`, `--text`, `--accent`, `--on-accent`, …), never raw
  colours. Themes are `data-theme="dark" | "light"` on `<html>`.
- Yellow is a **fill** with black text on it. It is never used as text on white (insufficient contrast);
  `--accent-text` resolves to yellow in dark and black in light.
- Status is always icon + label + shape (solid / tinted / dashed), never colour alone.
- Touch targets are at least 44px; inputs are 16px to avoid focus-zoom on mobile; safe-area insets are
  respected; `prefers-reduced-motion` is honoured.
- System font stack (no web-font download): fast on low-end Android and nothing fetched from third parties.

## Preferences and local data

| Key | Content | Owner |
| --- | --- | --- |
| `remo.preferences.v1` | `{ language, theme }` | platform |
| `remo.life.tasks.v1` | task array | REMO LIFE |

- Everything read from storage passes through a parser that tolerates missing/corrupt data.
- Keys are versioned for future migrations. Changes sync between open tabs.
- A small inline script in `index.html` applies language and theme before first paint. It mirrors
  `preferences.ts`; change both together.
- Nothing leaves the device. There are no analytics, cookies, or network calls other than loading the app.

## PWA

- `vite-plugin-pwa` generates the web manifest and a Workbox service worker that precaches the app shell.
- Update strategy is **prompt**: a new version shows a "Reload" toast; it never reloads on its own.
- Install button appears in Settings when the browser offers it (Chrome/Edge/Samsung Internet on Android);
  otherwise manual instructions are shown.
- The service worker is active only in production builds (`npm run build && npm run preview`), over HTTPS
  or localhost.

## Routing

Hash routing (`/#/wallet`). Chosen so deep links work on any static host without server configuration.
When a server or edge runtime is introduced, switching to path routing is a one-line change in `App.tsx`.

## Security posture

- No secrets exist in this repository, and none may be added to client code. `VITE_*` variables are public.
- Future provider keys (AI, payments, market data) live only in server-side functions.
- No `dangerouslySetInnerHTML`; user text is rendered as text.
