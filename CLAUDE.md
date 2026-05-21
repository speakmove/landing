# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
nvm use                    # node version from .nvmrc
npm install
npm run dev                # next dev → http://localhost:3000 (redirects to /ru)
npm run build              # next build (production, must pass with zero warnings)
npm run start              # next start
npm run lint               # eslint .
npm run typecheck          # tsc --noEmit
npm run format             # prettier --write .
npm run format:check       # prettier --check .
```

There is **no test runner** in this repo — unit/E2E tests were explicitly out of scope (see `docs/superpowers/specs/2026-05-13-speakmove-landing-design.md` §13). Don't add Jest/Vitest/Playwright unless asked.

Single source of truth for the design is `docs/superpowers/specs/2026-05-13-speakmove-landing-design.md` — consult it for unimplemented widgets, content mapping, and acceptance criteria.

## Architecture

**Stack:** Next.js 16 App Router (RSC default) · React 19 · TypeScript strict (`noUncheckedIndexedAccess`) · TailwindCSS v4 (CSS-first, no `tailwind.config.js`) · next-intl v4 · `@t3-oss/env-nextjs` + zod.

### Feature-Sliced Design with numeric prefixes

The `01_app` FSD layer is physically `app/` at repo root (Next.js requires this name). All other layers live in `src/` with numeric prefixes so IDEs sort them top-down by dependency:

```
app/                     # 01_app — App Router pages (thin, delegate into 02_pages)
src/02_pages/            # page compositions (RSC)
src/03_widgets/          # site-header, home-hero, pricing-hero, faq-section, …
src/04_features/         # waitlist-form, locale-switch
src/05_entities/         # advantage-tile, brand, faq-item, pricing-card, …
src/06_shared/           # ui/, config/, model/ (hooks, libs, utils)
```

Path aliases (`tsconfig.json`):
- `@/pages/*` → `src/02_pages/*`
- `@/widgets/*` → `src/03_widgets/*`
- `@/features/*` → `src/04_features/*`
- `@/entities/*` → `src/05_entities/*`
- `@/shared/*` → `src/06_shared/*`

`app/` doesn't get an alias — pages there are thin wrappers that import from `@/pages/*`.

### FSD rules (enforced socially, not by tooling)

- **No cross-slice imports within the same layer.** Two widgets/features/entities must not import each other; shared code goes to `06_shared/`.
- **Imports flow downward only:** entities → shared, features → entities/shared, widgets → features/entities/shared, pages → widgets/features/entities/shared. Never upward.
- **Public API via index files:** each slice exposes a single `index.ts`; consumers import from the slice root, not from `ui/`/`model/` internals.
- **Hooks live in `model/hooks/useFoo.ts`** (camelCase file matches export). Not `model/use-foo.ts`.

### i18n (next-intl)

- Locales: `ru` (default), `uk`, `en`. All URLs are prefixed (`/ru/...`, `/uk/...`, `/en/...`).
- Routing config: `src/06_shared/model/libs/i18n/routing.ts` (use the re-exported locale-aware `Link`, `useRouter`, etc. from there — not `next/link`).
- Request config: `src/06_shared/model/libs/i18n/request.ts` (wired in `next.config.ts` via `createNextIntlPlugin`).
- **Middleware lives at `proxy.ts` in the repo root** — Next.js 16 renamed `middleware.ts` → `proxy.ts`. Don't recreate `middleware.ts`.
- Messages: `messages/{ru,uk,en}.json`, organized by page namespace (`HomePage`, `PricingPage`, `MetaGlobal`, …). Every page must call `setRequestLocale(locale)` before `getTranslations` to enable static rendering.
- All routes statically generated via `generateStaticParams` from `routing.locales`.

### Page → widget composition

`app/[locale]/<route>/page.tsx` files are thin: they call `setRequestLocale`, then render a Page component from `src/02_pages/<route>/ui/<Route>Page.tsx`. Pages compose widgets; widgets compose entities; entities use `shared/ui`. Don't put copy or business logic in `app/`.

Error/404 handling layout:
- `app/global-error.tsx` — root-level crash (client component).
- `app/not-found.tsx` — URL without locale (technical fallback, no i18n).
- `app/[locale]/not-found.tsx` — translated 404, renders `NotFoundPage`.
- `app/[locale]/[...rest]/page.tsx` — catch-all calling `notFound()`.
- `app/[locale]/error.tsx` — translated runtime errors, renders `ErrorPage`.

## Coding conventions

ESLint enforces most of these (`eslint.config.mjs`); when in doubt, ESLint wins.

### TypeScript

- **`type` only — no `interface`.** Enforced via `@typescript-eslint/consistent-type-definitions`.
- **All named types prefixed `T`** (`TLocale`, `TWaitlistFormState`, `TProps`). Generics keep single letters (`T`, `U`, `K`, `V`). Enforced via `@typescript-eslint/naming-convention`.
- `type` imports must use `import type` syntax (`consistent-type-imports`).
- `any` is banned (`@typescript-eslint/no-explicit-any: error`).

### React 19

- **Never import `default` from `react`** — banned via `no-restricted-imports`. Import the specific APIs (`useState`, `ReactNode`, `ComponentPropsWithRef`, …).
- **No `forwardRef`** — `ref` is a regular prop in React 19. For DOM-component props, use `ComponentPropsWithRef<'button'>` and destructure `ref` from props.
- **Server Components by default.** Add `'use client'` only when a component needs hooks, event handlers, or browser-only APIs.
- Use `PropsWithChildren<{...}>` instead of redeclaring `children: ReactNode`.

### Styling — Tailwind v4

- Design tokens live in `app/globals.css` under `@theme { … }`. There is **no `tailwind.config.js`** — Tailwind v4 is CSS-first.
- **No arbitrary values** (`text-[14px]`, `bg-[#fff]`, `rounded-[4px]`). Use the native scale or add a token to `@theme` first.
- **No inline `style={{...}}`.** Everything through `className` + Tailwind utilities. CSS variables exposed via `@theme` are the escape hatch for dynamic values.
- **Layer ordering trap (Tailwind v4):** if you write a CSS rule that needs to override a Tailwind utility, put it **outside** `@layer components`. Utilities-layer always wins over the `components` layer regardless of source order.
- The Tailwind class merge helper is `cn` from `@/shared/model/libs/cn` (clsx + tailwind-merge).

### Icons & SVG

- **No inline `<svg>` in JSX.** All icons live in `src/06_shared/ui/Icon/` and are exported from `@/shared/ui` (`Icon`, `ArrowRightIcon`, `CheckIcon`, `LogoHorizontal`, …). Add a new file under `Icon/` and re-export — don't paste raw SVG into components.

### Branching logic

- **For 3+ branches on a discriminator, use a `Record<K, V>` mapper, not if/else chains.** The advantage/scenario/step variant tiles in this codebase follow this pattern (see `src/05_entities/advantage-tile/model/maps.tsx`).

### Copy

- **Don't reference AI vendor names in user-facing copy** (no "OpenAI", "Whisper", "GPT", "Hume", etc.). Use functional terms ("voice recognition", "AI tutor"). This is a positioning/competitive-moat decision — not a typo. Vendor names are fine in code comments and internal docs.

## Environment

`.env.example` documents required vars. `src/06_shared/model/libs/env/env.ts` validates them via `@t3-oss/env-nextjs` + zod at build time. Required public var: `NEXT_PUBLIC_SITE_URL`. Use `env` from `@/shared/model/libs/env` in code — never read `process.env` directly.

## Security headers

CSP and standard hardening headers are set in `next.config.ts` `headers()`. CSP includes `'unsafe-eval'` **only** when `NODE_ENV !== 'production'` (needed for React Refresh/HMR); production builds never see it. If you add an external script/font/connect domain, update the CSP allowlist there.
