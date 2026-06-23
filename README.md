# SpeakMove Landing

Production landing page for SpeakMove. Built with Next.js 16, App Router, TypeScript, TailwindCSS v4, and next-intl.

## Stack

- Next.js 16 (App Router, RSC)
- React 19, TypeScript strict
- TailwindCSS v4 (`@theme` tokens)
- next-intl (sub-path routing: `/ru` default, `/uk`, `/en`)
- @t3-oss/env-nextjs + zod
- Feature-Sliced Design

## Architecture

See `docs/superpowers/specs/2026-05-13-speakmove-landing-design.md`.

## Quick start

```bash
nvm use
cp .env.example .env.local   # fill in NEXT_PUBLIC_SITE_URL
npm install
npm run dev
```

App on http://localhost:3000 → redirects to http://localhost:3000/ru.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check

## FSD layers

```
app/                     # Next.js App Router (FSD 01_app)
src/02_pages/            # page compositions
src/03_widgets/          # site-header, hero, etc.
src/04_features/         # waitlist-form, locale-switch
src/05_entities/         # brand, pricing-tier, ...
src/06_shared/           # ui, model/hooks/utils/libs
```

## i18n

- Locales: `ru` (default), `uk`, `en`
- All URLs prefixed: `/ru/...`, `/uk/...`, `/en/...`
- Messages: `messages/{locale}.json`
- Locale detection and redirects live in `proxy.ts` at the repo root (Next.js 16's rename of `middleware.ts`).
