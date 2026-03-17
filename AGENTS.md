# AGENTS.md

Shared guidance for AI coding agents working with this repository.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_API_BASE_URL` | Yes | Base URL for API requests (e.g. `https://dummyjson.com`) |
| `APP_FEATURE_DARK_MODE` | No | Set to `true` to enable the dark mode toggle |

## Project structure

```
src/
├── index.tsx         # App entry — renders <ErrorBoundary><App /></ErrorBoundary>
├── router.tsx        # createBrowserRouter config + publicOnlyLoader/protectedLoader
├── api/              # Domain API functions (call requestWithNotify)
├── assets/           # Fonts, SVGs, images
├── components/       # Shared UI components
│   ├── action-icon/
│   ├── button/
│   ├── error-boundary/
│   ├── input/
│   ├── link/         # NavLink wrapper with same-location click prevention
│   ├── loader/       # Loader spinner + SuspenseLoader wrapper
│   ├── notifications/ # Toast notification list (auto-dismiss + manual)
│   ├── pagination/
│   ├── records-list/
│   ├── switch/
│   └── virtual-table/ # Virtualized sortable/paginated table
├── config/           # API base URL, request defaults, feature flags
├── constants/        # HTTP header names and content-type strings
├── controllers/
│   └── request/      # Low-level fetch wrapper (timeout, error typing)
├── hooks/
│   ├── use-async-data.ts    # Generic async state with staleness guard
│   └── use-auto-scroll-on-navigation.ts
├── layouts/
│   └── main/         # App shell (header, nav, Outlet)
├── lib/
│   └── setup-tests.ts  # jest-dom + jsdom polyfills
├── routes/           # Page-level components
│   ├── dashboard/    # lazy-loaded (layout + index + users + user)
│   ├── index/        # NOT lazy — included in initial bundle
│   ├── login/        # lazy-loaded
│   └── route-error/  # NOT lazy — included in initial bundle
├── state/
│   ├── store.ts      # Zustand root store (auth + users + notifications)
│   ├── theme.tsx     # ThemeContext (light/dark, persisted to localStorage)
│   └── slices/       # auth · users · notifications
├── styles/           # Global resets, variables, base styles
├── types/            # Shared TypeScript types
└── utils/
    ├── api.ts          # attachQueryParams (URLSearchParams)
    ├── request.ts      # requestWithNotify — fetch + auto error notification
    └── string.ts       # getRandomId (crypto.randomUUID)
```

## Setup

```bash
cp .env.example .env   # fill in APP_API_BASE_URL (required)
npm install
npm start              # http://localhost:8000
```

Node.js v22+ required.

## Commands

```bash
npm start                          # Dev server at http://localhost:8000
npm run build                      # Production build to ./build
npm run lint                       # Run ESLint + Stylelint
npm run lint:fix                   # Auto-fix lint issues
npm run eslint                     # ESLint only
npm run stylelint                  # Stylelint on **/*.scss files only
npm run test                       # Run Jest test suite
npm run test:coverage              # Run Jest with coverage report
npx jest src/path/to/file          # Run a single test file
npx jest --testNamePattern "name"  # Run tests matching a name pattern
npm run clean                      # Remove node_modules and ./build
ANALYZE=true npm run build         # Production build + bundle analyzer
```

## Architecture

**React 19 + TypeScript SPA** bundled with Webpack 5.

### Routing (`src/router.tsx`)

Routes are defined with `createBrowserRouter` (React Router v7). The root layout is `MainLayout`, which wraps all routes via `<Outlet />`. The dashboard route has its own nested children (`/dashboard`, `/dashboard/users`, `/dashboard/users/:id`).

Auth guards run as route loaders before the route renders:
- `publicOnlyLoader` — redirects logged-in users away from `/login`
- `protectedLoader` — redirects unauthenticated users to `/login`

Both use `useAppStore.getState()` (Zustand outside React — no hook needed in loaders).

Most page routes are lazy-loaded (`React.lazy` + `import(/* webpackChunkName */)`). The initial bundle carries only the shell: `MainLayout`, `Index` (homepage), and `RouteError`.

### State Management (`src/state/`)

**Zustand** is the primary store. **React Context** is kept for dependency-injection concerns that don't need Zustand's features.

**Zustand store** (`src/state/store.ts`, `src/state/slices/`):
- `useAppStore` — root store with all slice fields merged flat (`AppStore = AuthSlice & UsersSlice & NotificationsSlice`). There is no `auth`, `users`, or `notifications` key — all fields live at the root:
  - Auth: `isLogged`, `username`, `role`, `setLoggedUser`, `logout`
  - Users: `users[]`, `isLoaded`, `setUsersList`
  - Notifications: `notifications[]`, `onShowNotification`, `onDismissNotification`
- Middleware: `persist` (sessionStorage, auth fields only via `partialize`) + `devtools`
- `safeSessionStorage` wrapper swallows storage errors (private browsing, quota, security restrictions)
- Actions are stable references — select them separately without `useShallow`
- Outside React: `useAppStore.getState()` / `useAppStore.setState(...)`

**React Context** (`src/state/theme.tsx`):
- `ThemeProvider` / `useTheme` — light/dark preference, persisted to `localStorage`, respects `prefers-color-scheme`
- Use Context (not Zustand) when: value changes rarely, no partial subscriptions needed, no async/persistence/middleware required

**Ephemeral UI state** (form fields, local toggles) stays in component-local `useState`. Not in Zustand.

### API Layer

Two tiers — kept separate so the transport has no UI dependency:

- **`src/controllers/request/index.ts`** — low-level `request<T>(params)`. Fetch API + `AbortController` timeout (15 s). Returns `RequestResult<T>` = `{ok: true, data: T} | {ok: false, error: RequestError}`. Accepts optional `onError` callback. **No store imports.**
- **`src/utils/request.ts` → `requestWithNotify`** — wraps `request`, injects an `onError` that shows a toast via the store and also forwards to any caller-supplied `onError`. All `src/api/*.ts` functions use this.
- **`src/api/*.ts`** — domain functions (`getUsers`, `getUser`, `login`) calling `requestWithNotify`.
- **`src/config/index.ts`** — `API_BASE_URL`, `DEFAULT_REQUEST_HEADERS`, `REQUEST_TIMEOUT_DURATION`, feature flags. Throws at startup if `APP_API_BASE_URL` is missing.
- **`src/utils/api.ts`** — `attachQueryParams` helper using `URLSearchParams` (no `qs` dependency).

### Async Data Hooks

- **`useAsyncData`** (`src/hooks/use-async-data.ts`) — generic `{state, run}` hook. Manages `isLoading / error / data` via `useReducer`. **Staleness guard**: each `run()` call increments an internal counter (`latestCallId`); only the most recent invocation can commit state. Prevents out-of-order responses from overwriting newer data.
- **`useTableData`** (`src/hooks/use-table-data.ts`) — builds on `useAsyncData`. Takes a `fetcher(params: TableParams)` and exposes `{data, total, isLoading, error, onParamsChange, refresh}`. Initial params: `{limit: 20, skip: 0}`.

### Notifications

`onShowNotification(type, message, duration?)` adds a toast; duration defaults to 5000 ms. `duration: 0` makes it persistent. List is capped at 5 (oldest dropped). The `Notifications` component auto-dismisses via `setTimeout` and clears it on unmount. IDs use `crypto.randomUUID()`.

### Components

- **`VirtualTable`** — `react-virtuoso` `TableVirtuoso` wrapper with sorting and pagination. Uses `useReducer` for coordinated `{sortKey, sortDir, page, pageSize}` state (sort resets page to 1). Calls `onParamsChange` on every sort/page change.
- **`Link`** — `NavLink` wrapper. Calls `e.preventDefault()` when the target matches current `pathname + search + hash`. Passes through modifier-key clicks (Ctrl/Meta/Alt/Shift) and non-primary mouse buttons unchanged.
- **`Loader` / `SuspenseLoader`** — spinner and `<Suspense>` wrapper. Default fallback is `<Loader />`.
- **`Notifications`** — renders the store's notification queue as dismissible toasts.
- **`ErrorBoundary`** — class component wrapping the entire app in `src/index.tsx`.

### Styling

SCSS Modules per component (`button.module.scss` alongside `index.tsx`). Global variables in `src/styles/variables.scss`. Dart Sass with `@use '…' as *` (no `@import`). PostCSS for autoprefixing only — no variable/import plugins. CSS class names must be camelCased (enforced by Stylelint). SCSS modules typed as `Record<string, string>` via `src/declaration.d.ts`.

### Webpack

Three config files merged via `webpack-merge`: `common`, `dev`, `prod`. `ts-loader` handles TypeScript (no Babel); uses `tsconfig.build.json` so test files are excluded from the build type-check. SVGs → React components via `@svgr/webpack`. Raster images emitted as content-hashed files; prod re-compresses with `sharp`.

### TypeScript

Three tsconfig files:
- `tsconfig.json` — IDE/editor; includes all of `src/`
- `tsconfig.build.json` — extends base, excludes test/mock/setup files; used by `ts-loader`
- `tsconfig.test.json` — extends base, `module: commonjs` + `moduleResolution: node`; used by `ts-jest`

Path alias: `"@/*": ["./src/*"]` — `@/`-prefixed imports map to `src/`. Strict mode enabled. `.tsx` files require explicit return types (`@typescript-eslint/explicit-function-return-type`). Do not import React for JSX — the JSX runtime transform is configured.

### Testing

**Jest 30 + React Testing Library v16** (RTL v16 required for React 19).

- `jest.config.ts` — `ts-jest` preset, `jest-environment-jsdom`, `modulePaths: ['<rootDir>/src']`
- `src/lib/setup-tests.ts` — imports `@testing-library/jest-dom`; polyfills `TextEncoder`/`TextDecoder`
- `src/__mocks__/svgMock.tsx` + `src/__mocks__/fileMock.ts` — stub SVG and raster imports
- SCSS modules → `identity-obj-proxy`; `.css` → same

**`moduleNameMapper` order matters**: the `\.svg$` pattern must come **before** the `^@/(.*)$` alias, otherwise `@/assets/svg/…svg` resolves to the real file before the mock can match.

Test file locations follow `src/**/__tests__/` convention. Key patterns:
- Access Zustand state directly: `useAppStore.getState()` / `useAppStore.setState({…})` (no React wrapper needed)
- Reset store slices between tests: `beforeEach(() => useAppStore.setState({notifications: []}))`
- Mock `window.matchMedia` in tests that render theme-aware components (jsdom doesn't implement it)
- `APP_API_BASE_URL` is set in `jest.config.ts` before any module loads (config throws at startup if missing)
- Route loader tests: mock the whole `react-router-dom` module (including `redirect`) rather than polyfilling `Response` in jsdom

### ESLint

Flat config (`eslint.config.mjs`), ESLint v9 + `typescript-eslint` v8. Key rules:
- `react/function-component-definition` — arrow functions required for named components
- `no-console` — error
- `react-hooks/exhaustive-deps` — error
- `@typescript-eslint/explicit-function-return-type` — error (off in test files)
- `@typescript-eslint/strict-boolean-expressions` — off
- `@typescript-eslint/no-misused-promises` — error with `checksVoidReturn.attributes: false` (allows async event handlers)
- `no-unsafe-{assignment,member-access,call,argument,return}` — off in test files
- `react/no-array-index-key` — off (high false-positive rate; enforce stable keys at review time)
- File extensions omitted in imports (`.ts`, `.tsx`, `.js`, `.jsx`)

### Gotchas / non-obvious decisions

- `Button` always renders `<button>`. For nav CTAs that look like buttons, use `navigate()` in `onClick` — never wrap `<button>` in `<a>` (invalid HTML nesting).
- `Input` `onChange` is `(value: string) => void` — already unwrapped from the synthetic event.
- `SubmitEvent` is not a React export — use `FormEvent<HTMLFormElement>` for form submit handlers.
- `getRandomId` uses `crypto.randomUUID()`.
- Store `version: 0` in `persist` — Zustand discards mismatched persisted data automatically; `safeSessionStorage` handles any storage errors.
- Feature flags (`FEATURE_DARK_MODE`) are read from env vars and cast to boolean at config load time.
