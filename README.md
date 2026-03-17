# Back Office Template (Built on React.js)

| Layer | Technology |
|-------|-----------|
| UI | React 19 + TypeScript 5 |
| Routing | React Router v7 |
| State | Zustand v5 |
| Bundler | Webpack 5 + ts-loader |
| Styling | SCSS Modules + Dart Sass + PostCSS |
| Linting | ESLint v9 (flat config) + Stylelint v16 |
| Testing | Jest 30 + React Testing Library v16 |

## Requirements

- Node.js v22+

## Setup

```bash
cp .env.example .env   # fill in APP_API_BASE_URL (required)
npm install
npm start              # http://localhost:8000
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_API_BASE_URL` | Yes | Base URL for API requests (e.g. `https://dummyjson.com`) |
| `APP_FEATURE_DARK_MODE` | No | Set to `true` to enable the dark mode toggle |

## Commands

```bash
npm start              # Dev server → http://localhost:8000
npm run build          # Production build → ./build
npm test               # Jest test suite
npm run lint           # ESLint + Stylelint
npm run lint:fix       # Auto-fix lint issues
npm run clean          # Remove node_modules and ./build
ANALYZE=true npm run build   # Build + bundle analyzer
```
