# SpeakMove Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перенести статический HTML-лендинг LingoCoin (`/Users/dmitriy/Desktop/mvp/01_lingocoin/html/`) в production-репозиторий `speakmove-landing` со сменой бренда на **SpeakMove**, стеком Next.js 16 + App Router + RSC, TailwindCSS v4, next-intl, FSD с нумерованными слоями.

**Architecture:** App Router в корне `app/` (FSD слой `01_app`), остальные FSD-слои в `src/` с префиксами `02_pages` → `06_shared`. Маршрутизация и locale-детекция через `proxy.ts` (Next.js 16 + next-intl). Формы — RSC + Server Action + `useActionState` + zod + honeypot. Стили — Tailwind v4 (`@theme` в `globals.css`), типографика — `next/font/google`.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, TailwindCSS v4, next-intl v4, zod, @t3-oss/env-nextjs, clsx + tailwind-merge.

**Source of truth для дизайна:** `docs/superpowers/specs/2026-05-13-speakmove-landing-design.md`. Все архитектурные решения, контракты компонентов, соглашения по коду и acceptance criteria — там.

**Source of truth для разметки/контента:** `/Users/dmitriy/Desktop/mvp/01_lingocoin/html/*.html` + `styles.css`. План указывает конкретные line range'ы исходников там, где компонент берёт HTML оттуда. Бренд "LingoCoin" в текстах заменяем на "SpeakMove".

**Тесты:** Unit/E2E явно out of scope (см. spec §13). Verification — `npx tsc --noEmit` + `npm run lint` + `npm run build` после каждой существенной задачи + ручной smoke в браузере перед merge.

**Принципы:**
- Все типы с префиксом `T`, только `type` (без `interface`).
- Никаких `React.*` — импортируй конкретные API из `react`.
- Никаких `forwardRef` — `ref` это обычный проп в React 19.
- `'use client'` ставим только когда нужны hooks/event handlers/browser API.
- Мobile-first: стили без префикса = mobile, `sm:`/`md:`/`lg:`/`xl:` для desktop.
- Контент инлайн в компонентах = заглушки. Реальные тексты придут позже от заказчика; используем `useTranslations`/`getTranslations` с ключами, словари — заглушки на 3 локали.

---

## Phase 0 — Bootstrap

### Task 0.1: Инициализировать package.json и установить зависимости

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.nvmrc`

- [ ] **Step 1: Создать package.json**

```json
{
  "name": "speakmove-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

- [ ] **Step 2: Установить runtime зависимости**

```bash
npm install next@^16 react@^19 react-dom@^19 next-intl@^4 zod@^3 @t3-oss/env-nextjs@^0.13 clsx@^2 tailwind-merge@^2
```

- [ ] **Step 3: Установить dev зависимости**

```bash
npm install -D typescript@^5 @types/node@^22 @types/react@^19 @types/react-dom@^19 tailwindcss@^4 @tailwindcss/postcss@^4 postcss@^8 eslint@^9 eslint-config-next@^16 eslint-plugin-jsx-a11y@^6 @typescript-eslint/eslint-plugin@^8 @typescript-eslint/parser@^8 prettier@^3 prettier-plugin-tailwindcss@^0.6
```

- [ ] **Step 4: Создать .nvmrc**

```
20
```

- [ ] **Step 5: Создать .gitignore**

```
node_modules/
.next/
out/
build/
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode/
.idea/
coverage/
.turbo/
next-env.d.ts
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .gitignore .nvmrc
git commit -m "chore: bootstrap package.json and pin dependencies"
```

---

### Task 0.2: TypeScript config с FSD path aliases

**Files:**
- Create: `tsconfig.json`

- [ ] **Step 1: Создать tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/pages/*": ["./src/02_pages/*"],
      "@/widgets/*": ["./src/03_widgets/*"],
      "@/features/*": ["./src/04_features/*"],
      "@/entities/*": ["./src/05_entities/*"],
      "@/shared/*": ["./src/06_shared/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.json
git commit -m "chore: add tsconfig with strict mode and FSD path aliases"
```

---

### Task 0.3: ESLint flat config

**Files:**
- Create: `eslint.config.mjs`

- [ ] **Step 1: Создать eslint.config.mjs**

```js
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:jsx-a11y/recommended'),
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message: 'Импортируй конкретные API из react (useState, ReactNode и т.д.), не React.*',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['next.config.ts', 'proxy.ts', 'postcss.config.mjs', 'prettier.config.mjs'],
    rules: { '@typescript-eslint/naming-convention': 'off' },
  },
];
```

- [ ] **Step 2: Установить @eslint/eslintrc для совместимости**

```bash
npm install -D @eslint/eslintrc
```

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs package.json package-lock.json
git commit -m "chore: configure eslint with FSD-friendly rules and a11y plugin"
```

---

### Task 0.4: Prettier + PostCSS configs

**Files:**
- Create: `prettier.config.mjs`
- Create: `.prettierignore`
- Create: `postcss.config.mjs`

- [ ] **Step 1: prettier.config.mjs**

```js
export default {
  printWidth: 100,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
};
```

- [ ] **Step 2: .prettierignore**

```
.next/
node_modules/
package-lock.json
build/
out/
.cache/
*.lock
```

- [ ] **Step 3: postcss.config.mjs**

```js
export default {
  plugins: { '@tailwindcss/postcss': {} },
};
```

- [ ] **Step 4: Commit**

```bash
git add prettier.config.mjs .prettierignore postcss.config.mjs
git commit -m "chore: add prettier and postcss configs"
```

---

### Task 0.5: next.config.ts с security headers (без i18n плагина — добавится позже)

**Files:**
- Create: `next.config.ts`

- [ ] **Step 1: Создать next.config.ts**

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default config;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: add next.config with security headers"
```

---

### Task 0.6: globals.css c Tailwind v4 и @theme токенами

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Создать `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-primary: #047857;
  --color-primary-hover: #059669;
  --color-primary-pale: #ecfdf5;
  --color-primary-ink: #064e3b;
  --color-gold: #d4a017;
  --color-gold-accent: #f5b700;
  --color-gold-pale: #fef6d9;
  --color-ink: #0b1220;
  --color-muted: #4b5563;
  --color-faint: #9ca3af;
  --color-surface: #f7f8f5;
  --color-line: #e6e8e3;
  --color-line-strong: #d1d5db;
  --font-sans: var(--font-inter), -apple-system, "SF Pro Display", "Helvetica Neue", sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, Menlo, monospace;
  --shadow-soft: 0 2px 8px rgb(11 18 32 / 0.04);
  --shadow-mid: 0 8px 24px rgb(11 18 32 / 0.08);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background: var(--color-surface);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add Tailwind v4 globals.css with brand tokens"
```

---

### Task 0.7: .env.example

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Создать .env.example**

```
NEXT_PUBLIC_SITE_URL=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example template"
```

---

### Task 0.8: README с инструкциями запуска

**Files:**
- Create: `README.md`

- [ ] **Step 1: Создать README.md**

````markdown
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
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with quickstart and architecture pointers"
```

---

## Phase 1 — Shared libraries

### Task 1.1: cn утилита (clsx + tailwind-merge)

**Files:**
- Create: `src/06_shared/model/libs/cn/cn.ts`
- Create: `src/06_shared/model/libs/cn/index.ts`

- [ ] **Step 1: cn.ts**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: index.ts**

```ts
export { cn } from './cn';
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/06_shared/model/libs/cn
git commit -m "feat(shared): add cn utility (clsx + tailwind-merge)"
```

---

### Task 1.2: env через @t3-oss/env-nextjs

**Files:**
- Create: `src/06_shared/model/libs/env/env.ts`
- Create: `src/06_shared/model/libs/env/index.ts`

- [ ] **Step 1: env.ts**

```ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  emptyStringAsUndefined: true,
});
```

- [ ] **Step 2: index.ts**

```ts
export { env } from './env';
```

- [ ] **Step 3: Заполнить .env.local для локальной работы (НЕ коммитим)**

```bash
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" > .env.local
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/06_shared/model/libs/env
git commit -m "feat(shared): add env config with @t3-oss/env-nextjs"
```

---

### Task 1.3: i18n routing.ts

**Files:**
- Create: `src/06_shared/model/libs/i18n/routing.ts`

- [ ] **Step 1: routing.ts**

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'uk', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
});
```

- [ ] **Step 2: Commit**

```bash
git add src/06_shared/model/libs/i18n/routing.ts
git commit -m "feat(i18n): define routing with ru/uk/en locales"
```

---

### Task 1.4: i18n navigation.ts (locale-aware wrappers)

**Files:**
- Create: `src/06_shared/model/libs/i18n/navigation.ts`

- [ ] **Step 1: navigation.ts**

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

- [ ] **Step 2: Commit**

```bash
git add src/06_shared/model/libs/i18n/navigation.ts
git commit -m "feat(i18n): export locale-aware navigation helpers"
```

---

### Task 1.5: messages словари (минимальный набор ключей)

**Files:**
- Create: `messages/ru.json`
- Create: `messages/uk.json`
- Create: `messages/en.json`

- [ ] **Step 1: messages/ru.json**

```json
{
  "common": {
    "brand": "SpeakMove",
    "navHowItWorks": "Как это работает",
    "navAdvantages": "Преимущества",
    "navCompare": "Сравнение",
    "navPricing": "Цены",
    "ctaPrimary": "Начать бесплатно",
    "ctaSecondary": "Как это работает",
    "footerCopy": "© 2026 SpeakMove. Все права защищены.",
    "skipToContent": "Перейти к содержимому"
  },
  "languageSwitcher": {
    "label": "Язык сайта",
    "ru": "Русский",
    "uk": "Українська",
    "en": "English"
  },
  "home": {
    "title": "SpeakMove — учи язык, зарабатывай монеты",
    "description": "Telegram-бот для изучения языков. Голосовые диалоги, монеты за уроки, вывод на карту. 15 минут в день.",
    "heroBadge": "Telegram-бот · Без установки · Монеты за каждый урок",
    "heroH1": "Учи язык — зарабатывай монеты, которые выводишь на карту.",
    "heroLead": "Голосовые диалоги, домашние задания с x2 монет и структура по CEFR — прямо в Telegram. Английский, немецкий, норвежский. 15 минут в день.",
    "heroBullet1": "3 языка",
    "heroBullet2": "15 мин / день",
    "heroBullet3": "от $7 / мес",
    "heroBullet4": "0 установок"
  },
  "howItWorks": {
    "title": "Как работает SpeakMove",
    "description": "Шаги изучения языка с SpeakMove."
  },
  "pricing": {
    "title": "Цены SpeakMove",
    "description": "Тарифы и подписки SpeakMove."
  },
  "waitlist": {
    "title": "Запись в waitlist — SpeakMove",
    "description": "Получи ранний доступ к SpeakMove.",
    "form": {
      "emailLabel": "Email",
      "emailPlaceholder": "you@example.com",
      "submit": "Получить доступ",
      "submitting": "Отправка...",
      "serverError": "Ошибка сервера. Попробуйте позже.",
      "successTitle": "Вы в списке!",
      "successBody": "Мы напишем, как только откроем доступ.",
      "honeypotLabel": "Не заполняйте это поле"
    }
  },
  "privacy": {
    "title": "Политика конфиденциальности",
    "description": "Политика конфиденциальности SpeakMove."
  },
  "notFound": {
    "title": "Страница не найдена",
    "h1": "404",
    "lead": "Такой страницы нет. Возможно, она переехала или вы ошиблись адресом.",
    "cta": "На главную"
  },
  "error": {
    "title": "Что-то пошло не так",
    "h1": "Ошибка",
    "lead": "Мы уже разбираемся. Попробуйте обновить страницу.",
    "cta": "Обновить"
  }
}
```

- [ ] **Step 2: messages/uk.json (те же ключи, украинские строки-заглушки)**

```json
{
  "common": {
    "brand": "SpeakMove",
    "navHowItWorks": "Як це працює",
    "navAdvantages": "Переваги",
    "navCompare": "Порівняння",
    "navPricing": "Ціни",
    "ctaPrimary": "Почати безкоштовно",
    "ctaSecondary": "Як це працює",
    "footerCopy": "© 2026 SpeakMove. Усі права захищено.",
    "skipToContent": "Перейти до вмісту"
  },
  "languageSwitcher": {
    "label": "Мова сайту",
    "ru": "Русский",
    "uk": "Українська",
    "en": "English"
  },
  "home": {
    "title": "SpeakMove — вчи мову, заробляй монети",
    "description": "Telegram-бот для вивчення мов. Голосові діалоги, монети за уроки, виведення на картку. 15 хвилин на день.",
    "heroBadge": "Telegram-бот · Без встановлення · Монети за кожен урок",
    "heroH1": "Вчи мову — заробляй монети, які виводиш на картку.",
    "heroLead": "Голосові діалоги, домашні завдання з x2 монет і структура за CEFR — прямо в Telegram. Англійська, німецька, норвезька. 15 хвилин на день.",
    "heroBullet1": "3 мови",
    "heroBullet2": "15 хв / день",
    "heroBullet3": "від $7 / міс",
    "heroBullet4": "0 встановлень"
  },
  "howItWorks": {
    "title": "Як працює SpeakMove",
    "description": "Кроки вивчення мови із SpeakMove."
  },
  "pricing": {
    "title": "Ціни SpeakMove",
    "description": "Тарифи та підписки SpeakMove."
  },
  "waitlist": {
    "title": "Запис у waitlist — SpeakMove",
    "description": "Отримай ранній доступ до SpeakMove.",
    "form": {
      "emailLabel": "Email",
      "emailPlaceholder": "you@example.com",
      "submit": "Отримати доступ",
      "submitting": "Надсилання...",
      "serverError": "Помилка сервера. Спробуйте пізніше.",
      "successTitle": "Ви у списку!",
      "successBody": "Ми напишемо, щойно відкриємо доступ.",
      "honeypotLabel": "Не заповнюйте це поле"
    }
  },
  "privacy": {
    "title": "Політика конфіденційності",
    "description": "Політика конфіденційності SpeakMove."
  },
  "notFound": {
    "title": "Сторінку не знайдено",
    "h1": "404",
    "lead": "Такої сторінки немає. Можливо, вона переїхала або ви помилилися адресою.",
    "cta": "На головну"
  },
  "error": {
    "title": "Щось пішло не так",
    "h1": "Помилка",
    "lead": "Ми вже розбираємось. Спробуйте оновити сторінку.",
    "cta": "Оновити"
  }
}
```

- [ ] **Step 3: messages/en.json**

```json
{
  "common": {
    "brand": "SpeakMove",
    "navHowItWorks": "How it works",
    "navAdvantages": "Advantages",
    "navCompare": "Compare",
    "navPricing": "Pricing",
    "ctaPrimary": "Get started for free",
    "ctaSecondary": "How it works",
    "footerCopy": "© 2026 SpeakMove. All rights reserved.",
    "skipToContent": "Skip to content"
  },
  "languageSwitcher": {
    "label": "Site language",
    "ru": "Русский",
    "uk": "Українська",
    "en": "English"
  },
  "home": {
    "title": "SpeakMove — learn a language, earn coins",
    "description": "Telegram bot for learning languages. Voice dialogues, coins for lessons, payouts to a card. 15 minutes a day.",
    "heroBadge": "Telegram bot · No install · Coins for every lesson",
    "heroH1": "Learn a language — earn coins you can cash out to a card.",
    "heroLead": "Voice dialogues, x2-coin homework and a CEFR-aligned structure — right inside Telegram. English, German, Norwegian. 15 minutes a day.",
    "heroBullet1": "3 languages",
    "heroBullet2": "15 min / day",
    "heroBullet3": "from $7 / mo",
    "heroBullet4": "0 installs"
  },
  "howItWorks": {
    "title": "How SpeakMove works",
    "description": "Step-by-step language learning with SpeakMove."
  },
  "pricing": {
    "title": "SpeakMove pricing",
    "description": "Plans and subscriptions for SpeakMove."
  },
  "waitlist": {
    "title": "Waitlist signup — SpeakMove",
    "description": "Get early access to SpeakMove.",
    "form": {
      "emailLabel": "Email",
      "emailPlaceholder": "you@example.com",
      "submit": "Get access",
      "submitting": "Submitting...",
      "serverError": "Server error. Please try again later.",
      "successTitle": "You're on the list!",
      "successBody": "We'll email you as soon as access opens.",
      "honeypotLabel": "Do not fill this field"
    }
  },
  "privacy": {
    "title": "Privacy policy",
    "description": "Privacy policy for SpeakMove."
  },
  "notFound": {
    "title": "Page not found",
    "h1": "404",
    "lead": "This page doesn't exist. It might have moved, or the URL is incorrect.",
    "cta": "Go home"
  },
  "error": {
    "title": "Something went wrong",
    "h1": "Error",
    "lead": "We're looking into it. Please refresh the page.",
    "cta": "Refresh"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add messages
git commit -m "feat(i18n): add ru/uk/en message dictionaries (placeholder copy)"
```

---

### Task 1.6: i18n types.ts и request.ts

**Files:**
- Create: `src/06_shared/model/libs/i18n/types.ts`
- Create: `src/06_shared/model/libs/i18n/request.ts`

- [ ] **Step 1: types.ts**

```ts
import type ruMessages from '../../../../../messages/ru.json';
import type { routing } from './routing';

export type TLocale = (typeof routing.locales)[number];
export type TMessages = typeof ruMessages;
```

- [ ] **Step 2: request.ts**

```ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../../../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/model/libs/i18n/types.ts src/06_shared/model/libs/i18n/request.ts
git commit -m "feat(i18n): add request config and Locale/Messages types"
```

---

### Task 1.7: Подключить next-intl плагин в next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Обновить next.config.ts**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/06_shared/model/libs/i18n/request.ts');

const config: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withNextIntl(config);
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat(i18n): wire next-intl plugin to custom request.ts path"
```

---

### Task 1.8: proxy.ts (Next.js 16 routing boundary)

**Files:**
- Create: `proxy.ts`

- [ ] **Step 1: proxy.ts**

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/shared/model/libs/i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

- [ ] **Step 2: Commit**

```bash
git add proxy.ts
git commit -m "feat(i18n): add proxy.ts for locale detection and redirects"
```

---

### Task 1.9: Минимальный layout + page для верификации i18n routing

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`

> Это временные заглушки, чтобы проверить что роутинг работает. Полноценный layout и home-page будут собраны позже.

- [ ] **Step 1: app/[locale]/layout.tsx**

```tsx
import type { PropsWithChildren } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type TProps = PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: TProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: app/[locale]/page.tsx (заглушка)**

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server';

type TProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');
  return <main className="p-8 text-2xl">{t('brand')} — {locale}</main>;
}
```

- [ ] **Step 3: Запустить dev server и проверить роутинг**

```bash
npm run dev
```

Открой:
- `http://localhost:3000` → 308 на `/ru` → "SpeakMove — ru"
- `http://localhost:3000/uk` → "SpeakMove — uk"
- `http://localhost:3000/en` → "SpeakMove — en"
- `http://localhost:3000/de` → 404 (несуществующая локаль)

Останови dev server (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add app
git commit -m "feat(i18n): add minimal locale layout and home placeholder to verify routing"
```

---

## Phase 2 — Shared UI atoms

### Task 2.1: VisuallyHidden

**Files:**
- Create: `src/06_shared/ui/VisuallyHidden/VisuallyHidden.tsx`
- Create: `src/06_shared/ui/VisuallyHidden/index.ts`

- [ ] **Step 1: VisuallyHidden.tsx**

```tsx
import type { ComponentPropsWithRef, ElementType } from 'react';

type TProps<T extends ElementType = 'span'> = {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, 'as'>;

export function VisuallyHidden<T extends ElementType = 'span'>({
  as,
  className = '',
  ...rest
}: TProps<T>) {
  const Tag = as ?? 'span';
  return (
    <Tag
      className={`absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 ${className}`}
      style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)' }}
      {...(rest as object)}
    />
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { VisuallyHidden } from './VisuallyHidden';
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add src/06_shared/ui/VisuallyHidden
git commit -m "feat(shared/ui): add VisuallyHidden with polymorphic as prop"
```

---

### Task 2.2: SkipLink

**Files:**
- Create: `src/06_shared/ui/SkipLink/SkipLink.tsx`
- Create: `src/06_shared/ui/SkipLink/index.ts`

- [ ] **Step 1: SkipLink.tsx**

```tsx
type TProps = {
  href?: string;
  children: string;
};

export function SkipLink({ href = '#main', children }: TProps) {
  return (
    <a
      href={href}
      className="sr-only fixed left-4 top-4 z-50 rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-md focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-white"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { SkipLink } from './SkipLink';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/SkipLink
git commit -m "feat(shared/ui): add SkipLink (visible only on focus)"
```

---

### Task 2.3: Container

**Files:**
- Create: `src/06_shared/ui/Container/Container.tsx`
- Create: `src/06_shared/ui/Container/index.ts`

- [ ] **Step 1: Container.tsx**

```tsx
import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ children, className }: TProps) {
  return <div className={cn('mx-auto w-full max-w-[1180px] px-5', className)}>{children}</div>;
}
```

- [ ] **Step 2: index.ts**

```ts
export { Container } from './Container';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/Container
git commit -m "feat(shared/ui): add Container with responsive max-width and padding"
```

---

### Task 2.4: Section

**Files:**
- Create: `src/06_shared/ui/Section/Section.tsx`
- Create: `src/06_shared/ui/Section/index.ts`

- [ ] **Step 1: Section.tsx**

```tsx
import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = PropsWithChildren<{
  id?: string;
  className?: string;
  ariaLabelledBy?: string;
}>;

export function Section({ id, className, ariaLabelledBy, children }: TProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn('py-14 md:py-20', className)}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { Section } from './Section';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/Section
git commit -m "feat(shared/ui): add Section landmark with aria-labelledby support"
```

---

### Task 2.5: Button (React 19 — ref как проп)

**Files:**
- Create: `src/06_shared/ui/Button/Button.tsx`
- Create: `src/06_shared/ui/Button/index.ts`

- [ ] **Step 1: Button.tsx**

```tsx
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TVariant = 'primary' | 'outline' | 'ghost';
type TSize = 'sm' | 'md' | 'lg';

type TProps = ComponentPropsWithRef<'button'> & {
  variant?: TVariant;
  size?: TSize;
};

const variantClass: Record<TVariant, string> = {
  primary:
    'bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-[color:var(--color-primary-ink)]',
  outline:
    'border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)] focus-visible:outline-[color:var(--color-primary)]',
  ghost: 'bg-transparent text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)]',
};

const sizeClass: Record<TSize, string> = {
  sm: 'min-h-[36px] px-3 text-sm',
  md: 'min-h-[44px] px-5 text-[15px]',
  lg: 'min-h-[52px] px-6 text-base',
};

export function Button({
  ref,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: TProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { Button } from './Button';
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add src/06_shared/ui/Button
git commit -m "feat(shared/ui): add Button with primary/outline/ghost variants and ≥44px targets"
```

---

### Task 2.6: Label

**Files:**
- Create: `src/06_shared/ui/Label/Label.tsx`
- Create: `src/06_shared/ui/Label/index.ts`

- [ ] **Step 1: Label.tsx**

```tsx
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'label'> & {
  htmlFor: string;
};

export function Label({ ref, htmlFor, className, children, ...rest }: TProps) {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-[color:var(--color-ink)]', className)}
      {...rest}
    >
      {children}
    </label>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { Label } from './Label';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/Label
git commit -m "feat(shared/ui): add Label with required htmlFor"
```

---

### Task 2.7: Input

**Files:**
- Create: `src/06_shared/ui/Input/Input.tsx`
- Create: `src/06_shared/ui/Input/index.ts`

- [ ] **Step 1: Input.tsx**

```tsx
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'input'> & {
  invalid?: boolean;
};

export function Input({ ref, invalid, className, ...rest }: TProps) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid ? true : undefined}
      className={cn(
        'block w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors',
        'min-h-[44px] placeholder:text-[color:var(--color-faint)]',
        'focus-visible:border-[color:var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-pale)]',
        'disabled:cursor-not-allowed disabled:bg-[color:var(--color-surface)]',
        invalid
          ? 'border-red-500 focus-visible:ring-red-100'
          : 'border-[color:var(--color-line-strong)]',
        className,
      )}
      {...rest}
    />
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { Input } from './Input';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/Input
git commit -m "feat(shared/ui): add Input with invalid state and a11y attrs"
```

---

### Task 2.8: FieldError

**Files:**
- Create: `src/06_shared/ui/FieldError/FieldError.tsx`
- Create: `src/06_shared/ui/FieldError/index.ts`

- [ ] **Step 1: FieldError.tsx**

```tsx
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  id?: string;
  errors?: string[] | string;
  className?: string;
};

export function FieldError({ id, errors, className }: TProps) {
  if (!errors) return null;
  const list = Array.isArray(errors) ? errors : [errors];
  if (list.length === 0) return null;

  if (list.length === 1) {
    return (
      <p id={id} role="alert" className={cn('mt-1 text-sm text-red-600', className)}>
        {list[0]}
      </p>
    );
  }
  return (
    <ul id={id} role="alert" className={cn('mt-1 list-disc space-y-0.5 pl-5 text-sm text-red-600', className)}>
      {list.map((err, i) => (
        <li key={`${err}-${i}`}>{err}</li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { FieldError } from './FieldError';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/FieldError
git commit -m "feat(shared/ui): add FieldError supporting single string or bulleted list"
```

---

### Task 2.9: HoneypotField

**Files:**
- Create: `src/06_shared/ui/HoneypotField/HoneypotField.tsx`
- Create: `src/06_shared/ui/HoneypotField/index.ts`

- [ ] **Step 1: HoneypotField.tsx**

```tsx
type TProps = {
  name: string;
  label?: string;
};

export function HoneypotField({ name, label = 'Do not fill this field' }: TProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
      style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)' }}
    >
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { HoneypotField } from './HoneypotField';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/HoneypotField
git commit -m "feat(shared/ui): add HoneypotField (visually hidden, tabIndex -1, aria-hidden)"
```

---

### Task 2.10: Badge

**Files:**
- Create: `src/06_shared/ui/Badge/Badge.tsx`
- Create: `src/06_shared/ui/Badge/index.ts`

- [ ] **Step 1: Badge.tsx**

```tsx
import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = PropsWithChildren<{
  className?: string;
  tone?: 'neutral' | 'primary' | 'gold';
}>;

const toneClass: Record<NonNullable<TProps['tone']>, string> = {
  neutral: 'bg-white/85 border-[color:var(--color-line)] text-[color:var(--color-muted)]',
  primary: 'bg-[color:var(--color-primary-pale)] border-[color:var(--color-primary)] text-[color:var(--color-primary-ink)]',
  gold: 'bg-[color:var(--color-gold-pale)] border-[color:var(--color-gold)] text-[color:var(--color-ink)]',
};

export function Badge({ tone = 'neutral', className, children }: TProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold md:text-[13px]',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { Badge } from './Badge';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/Badge
git commit -m "feat(shared/ui): add Badge with neutral/primary/gold tones"
```

---

### Task 2.11: Card

**Files:**
- Create: `src/06_shared/ui/Card/Card.tsx`
- Create: `src/06_shared/ui/Card/index.ts`

- [ ] **Step 1: Card.tsx**

```tsx
import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = PropsWithChildren<{
  className?: string;
  as?: 'div' | 'article' | 'li';
}>;

export function Card({ as = 'div', className, children }: TProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-[color:var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)] transition-shadow',
        'hover:shadow-[var(--shadow-mid)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { Card } from './Card';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/Card
git commit -m "feat(shared/ui): add Card with polymorphic as prop"
```

---

### Task 2.12: Icon (один общий компонент-обёртка для inline SVG)

**Files:**
- Create: `src/06_shared/ui/Icon/Icon.tsx`
- Create: `src/06_shared/ui/Icon/Check.tsx`
- Create: `src/06_shared/ui/Icon/ArrowRight.tsx`
- Create: `src/06_shared/ui/Icon/Coin.tsx`
- Create: `src/06_shared/ui/Icon/index.ts`

- [ ] **Step 1: Icon.tsx (база)**

```tsx
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'svg'> & {
  size?: number;
  label?: string;
  children: ReactNode;
};

export function Icon({ ref, size = 16, label, className, children, ...rest }: TProps) {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: false as const };
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block shrink-0', className)}
      {...ariaProps}
      {...rest}
    >
      {children}
    </svg>
  );
}
```

- [ ] **Step 2: Check.tsx**

```tsx
import { Icon } from './Icon';
import type { ComponentProps } from 'react';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export function CheckIcon(props: TProps) {
  return (
    <Icon strokeWidth={3} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}
```

- [ ] **Step 3: ArrowRight.tsx**

```tsx
import { Icon } from './Icon';
import type { ComponentProps } from 'react';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export function ArrowRightIcon(props: TProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}
```

- [ ] **Step 4: Coin.tsx**

```tsx
import { Icon } from './Icon';
import type { ComponentProps } from 'react';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export function CoinIcon(props: TProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </Icon>
  );
}
```

- [ ] **Step 5: index.ts**

```ts
export { Icon } from './Icon';
export { CheckIcon } from './Check';
export { ArrowRightIcon } from './ArrowRight';
export { CoinIcon } from './Coin';
```

- [ ] **Step 6: Commit**

```bash
git add src/06_shared/ui/Icon
git commit -m "feat(shared/ui): add Icon base + Check/ArrowRight/Coin (a11y: aria-hidden or aria-label)"
```

---

### Task 2.13: Shared/ui barrel index

**Files:**
- Create: `src/06_shared/ui/index.ts`

- [ ] **Step 1: index.ts**

```ts
export { Badge } from './Badge';
export { Button } from './Button';
export { Card } from './Card';
export { Container } from './Container';
export { FieldError } from './FieldError';
export { HoneypotField } from './HoneypotField';
export { ArrowRightIcon, CheckIcon, CoinIcon, Icon } from './Icon';
export { Input } from './Input';
export { Label } from './Label';
export { Section } from './Section';
export { SkipLink } from './SkipLink';
export { VisuallyHidden } from './VisuallyHidden';
```

- [ ] **Step 2: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/ui/index.ts
git commit -m "feat(shared/ui): add barrel export"
```

---

## Phase 3 — Shared hooks

### Task 3.1: useMediaQuery

**Files:**
- Create: `src/06_shared/model/hooks/useMediaQuery.ts`

- [ ] **Step 1: useMediaQuery.ts**

```ts
'use client';
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/06_shared/model/hooks/useMediaQuery.ts
git commit -m "feat(shared/hooks): add useMediaQuery"
```

---

### Task 3.2: useReducedMotion

**Files:**
- Create: `src/06_shared/model/hooks/useReducedMotion.ts`
- Create: `src/06_shared/model/hooks/index.ts`

- [ ] **Step 1: useReducedMotion.ts**

```ts
'use client';
import { useMediaQuery } from './useMediaQuery';

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
```

- [ ] **Step 2: index.ts**

```ts
export { useMediaQuery } from './useMediaQuery';
export { useReducedMotion } from './useReducedMotion';
```

- [ ] **Step 3: Commit**

```bash
git add src/06_shared/model/hooks
git commit -m "feat(shared/hooks): add useReducedMotion and barrel"
```

---

## Phase 4 — Layout, 404, 500

### Task 4.1: Подключить шрифты (next/font/google) и обновить корневой layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Обновить app/[locale]/layout.tsx**

```tsx
import type { PropsWithChildren } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { SkipLink } from '@/shared/ui';
import { getTranslations } from 'next-intl/server';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['500', '600'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type TProps = PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: TProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('common');
  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SkipLink>{t('skipToContent')}</SkipLink>
          <main id="main">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

> SiteHeader/SiteFooter добавим в Phase 6, после того как соберём widgets.

- [ ] **Step 2: Запустить dev server и проверить что шрифты подгружаются**

```bash
npm run dev
```

Открой `/ru`. Открой DevTools → Network → проверь что `inter.woff2`/`jetbrains-mono.woff2` загружаются с self-host (не fonts.gstatic.com). Закрой dev server.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat(app): wire next/font (Inter + JetBrains Mono) into locale layout"
```

---

### Task 4.2: 02_pages/not-found + 02_pages/error

**Files:**
- Create: `src/02_pages/not-found/ui/NotFoundPage.tsx`
- Create: `src/02_pages/not-found/index.ts`
- Create: `src/02_pages/error/ui/ErrorPage.tsx`
- Create: `src/02_pages/error/index.ts`

- [ ] **Step 1: NotFoundPage.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Button, Container, Section } from '@/shared/ui';

export async function NotFoundPage() {
  const t = await getTranslations('notFound');
  return (
    <Section>
      <Container className="max-w-[640px] text-center">
        <p className="font-mono text-6xl font-bold text-[color:var(--color-primary)]">{t('h1')}</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-[color:var(--color-muted)]">{t('lead')}</p>
        <Link href="/" className="mt-8 inline-block">
          <Button variant="primary" size="lg">
            {t('cta')}
          </Button>
        </Link>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: 02_pages/not-found/index.ts**

```ts
export { NotFoundPage } from './ui/NotFoundPage';
```

- [ ] **Step 3: ErrorPage.tsx**

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { Button, Container, Section } from '@/shared/ui';

type TProps = {
  reset: () => void;
};

export function ErrorPage({ reset }: TProps) {
  const t = useTranslations('error');
  return (
    <Section>
      <Container className="max-w-[640px] text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t('h1')}</h1>
        <p className="mt-3 text-[color:var(--color-muted)]">{t('lead')}</p>
        <Button variant="primary" size="lg" className="mt-8" onClick={reset}>
          {t('cta')}
        </Button>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: 02_pages/error/index.ts**

```ts
export { ErrorPage } from './ui/ErrorPage';
```

- [ ] **Step 5: Commit**

```bash
git add src/02_pages/not-found src/02_pages/error
git commit -m "feat(pages): add NotFoundPage and ErrorPage with translations"
```

---

### Task 4.3: app/[locale]/not-found.tsx + error.tsx + [...rest]/page.tsx

**Files:**
- Create: `app/[locale]/not-found.tsx`
- Create: `app/[locale]/error.tsx`
- Create: `app/[locale]/[...rest]/page.tsx`

- [ ] **Step 1: app/[locale]/not-found.tsx**

```tsx
import { NotFoundPage } from '@/pages/not-found';

export default function NotFound() {
  return <NotFoundPage />;
}
```

- [ ] **Step 2: app/[locale]/error.tsx**

```tsx
'use client';
import { useEffect } from 'react';
import { ErrorPage } from '@/pages/error';

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: TProps) {
  useEffect(() => {
    console.error('[locale-error]', error);
  }, [error]);
  return <ErrorPage reset={reset} />;
}
```

- [ ] **Step 3: app/[locale]/[...rest]/page.tsx**

```tsx
import { notFound } from 'next/navigation';

export default function CatchAllPage(): never {
  notFound();
}
```

- [ ] **Step 4: Smoke check**

```bash
npm run dev
```

Открой `http://localhost:3000/ru/does-not-exist` → должна показаться локализованная 404. Закрой dev server.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/not-found.tsx app/[locale]/error.tsx 'app/[locale]/[...rest]'
git commit -m "feat(app): add locale-aware 404, error and [...rest] catch-all"
```

---

### Task 4.4: app/not-found.tsx + app/global-error.tsx (global fallbacks)

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/global-error.tsx`

- [ ] **Step 1: app/not-found.tsx (по примеру next-intl playground)**

```tsx
'use client';
import Error from 'next/error';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: app/global-error.tsx**

```tsx
'use client';
import { useEffect } from 'react';

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: TProps) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <button type="button" onClick={reset} style={{ marginTop: '1rem' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx app/global-error.tsx
git commit -m "feat(app): add global not-found and global-error fallbacks"
```

---

## Phase 5 — Brand entities

### Task 5.1: 05_entities/brand/Logo

**Files:**
- Create: `src/05_entities/brand/ui/Logo.tsx`

- [ ] **Step 1: Logo.tsx**

```tsx
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
};

export function Logo({ className }: TProps) {
  const t = useTranslations('common');
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight', className)}>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-gold-accent)] to-[color:var(--color-gold)] text-[11px] font-extrabold text-white"
      >
        SM
      </span>
      <span>{t('brand')}</span>
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/05_entities/brand/ui/Logo.tsx
git commit -m "feat(entities/brand): add Logo component with gradient SM badge"
```

---

### Task 5.2: 05_entities/brand/BrandCoin + barrel

**Files:**
- Create: `src/05_entities/brand/ui/BrandCoin.tsx`
- Create: `src/05_entities/brand/index.ts`

- [ ] **Step 1: BrandCoin.tsx**

```tsx
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
  size?: number;
  label?: string;
};

export function BrandCoin({ className, size = 28, label }: TProps) {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };
  return (
    <span
      {...ariaProps}
      style={{ width: size, height: size }}
      className={cn(
        'grid place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-gold-accent)] to-[color:var(--color-gold)] text-[10px] font-extrabold text-white',
        className,
      )}
    >
      SM
    </span>
  );
}
```

- [ ] **Step 2: 05_entities/brand/index.ts**

```ts
export { Logo } from './ui/Logo';
export { BrandCoin } from './ui/BrandCoin';
```

- [ ] **Step 3: Commit**

```bash
git add src/05_entities/brand
git commit -m "feat(entities/brand): add BrandCoin + barrel"
```

---

## Phase 6 — Header, Footer, LocaleSwitch

### Task 6.1: 04_features/locale-switch

**Files:**
- Create: `src/04_features/locale-switch/ui/LocaleSwitch.tsx`
- Create: `src/04_features/locale-switch/index.ts`

- [ ] **Step 1: LocaleSwitch.tsx**

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/shared/model/libs/i18n/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { cn } from '@/shared/model/libs/cn';

const labelKey = {
  ru: 'ru',
  uk: 'uk',
  en: 'en',
} as const;

export function LocaleSwitch() {
  const current = useLocale();
  const pathname = usePathname();
  const tNav = useTranslations('languageSwitcher');

  return (
    <nav aria-label={tNav('label')}>
      <ul className="flex items-center gap-0.5 rounded-full border border-[color:var(--color-line)] bg-white p-0.5 text-[12px] font-semibold">
        {routing.locales.map((locale) => {
          const isActive = locale === current;
          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                hrefLang={locale}
                lang={locale}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-[28px] items-center rounded-full px-2.5 transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]',
                  isActive
                    ? 'bg-[color:var(--color-primary)] text-white'
                    : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]',
                )}
              >
                {tNav(labelKey[locale])}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { LocaleSwitch } from './ui/LocaleSwitch';
```

- [ ] **Step 3: Commit**

```bash
git add src/04_features/locale-switch
git commit -m "feat(features/locale-switch): locale-aware nav with hreflang and aria-current"
```

---

### Task 6.2: 03_widgets/site-header

**Files:**
- Create: `src/03_widgets/site-header/ui/SiteHeader.tsx`
- Create: `src/03_widgets/site-header/index.ts`

- [ ] **Step 1: SiteHeader.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Logo } from '@/entities/brand';
import { Button, Container } from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { ArrowRightIcon } from '@/shared/ui';

export async function SiteHeader() {
  const t = await getTranslations('common');

  const navItems = [
    { href: '/how-it-works', key: 'navHowItWorks' as const },
    { href: '/#advantages', key: 'navAdvantages' as const },
    { href: '/#compare', key: 'navCompare' as const },
    { href: '/pricing', key: 'navPricing' as const },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-line)] bg-white/85 backdrop-blur">
      <Container>
        <div className="flex min-h-[64px] items-center gap-4 py-3">
          <Link href="/" aria-label={t('brand')}>
            <Logo />
          </Link>
          <nav aria-label="Primary" className="ml-3 hidden lg:flex">
            <ul className="flex gap-7 text-[14.5px] font-medium text-[color:var(--color-muted)]">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex-1" />
          <div className="hidden sm:block">
            <LocaleSwitch />
          </div>
          <Link href="/waitlist">
            <Button size="sm">
              {t('ctaPrimary')}
              <ArrowRightIcon size={14} />
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { SiteHeader } from './ui/SiteHeader';
```

- [ ] **Step 3: Commit**

```bash
git add src/03_widgets/site-header
git commit -m "feat(widgets/site-header): sticky header with nav, LocaleSwitch and CTA"
```

---

### Task 6.3: 03_widgets/site-footer

**Files:**
- Create: `src/03_widgets/site-footer/ui/SiteFooter.tsx`
- Create: `src/03_widgets/site-footer/index.ts`

- [ ] **Step 1: SiteFooter.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Container } from '@/shared/ui';
import { Logo } from '@/entities/brand';

export async function SiteFooter() {
  const t = await getTranslations('common');
  return (
    <footer className="border-t border-[color:var(--color-line)] bg-white">
      <Container>
        <div className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label={t('brand')}>
            <Logo />
          </Link>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[color:var(--color-muted)]">
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                >
                  {t('navPricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                >
                  {t('navHowItWorks')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-xs text-[color:var(--color-faint)]">{t('footerCopy')}</p>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { SiteFooter } from './ui/SiteFooter';
```

- [ ] **Step 3: Commit**

```bash
git add src/03_widgets/site-footer
git commit -m "feat(widgets/site-footer): brand, footer nav and copyright"
```

---

### Task 6.4: Подключить SiteHeader/SiteFooter в layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Обновить layout**

```tsx
import type { PropsWithChildren } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { SkipLink } from '@/shared/ui';
import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['500', '600'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type TProps = PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: TProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('common');
  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SkipLink>{t('skipToContent')}</SkipLink>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Smoke**

```bash
npm run dev
```

Открой `/ru`, `/uk`, `/en`. Проверь:
- Header показывает логотип, навигацию, LocaleSwitch, CTA.
- Footer показывает логотип, ссылки, копирайт.
- Tab сразу после загрузки → виден SkipLink.
- LocaleSwitch переключает локали без смены страницы.
- aria-current на активной локали.

Закрой dev server.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat(app): mount SiteHeader/SiteFooter in locale layout"
```

---

## Phase 7 — Home page

> Источник разметки: `/Users/dmitriy/Desktop/mvp/01_lingocoin/html/index.html` (1205 строк). Бьём на widget'ы по семантическим секциям. Бренд везде заменяем на SpeakMove. Тексты — placeholder'ы через `t('home.*')`, точные строки заменим позже.

### Task 7.1: 05_entities/scenario

**Files:**
- Create: `src/05_entities/scenario/model/types.ts`
- Create: `src/05_entities/scenario/ui/ScenarioCard.tsx`
- Create: `src/05_entities/scenario/index.ts`

- [ ] **Step 1: model/types.ts**

```ts
export type TScenario = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};
```

- [ ] **Step 2: ui/ScenarioCard.tsx**

```tsx
import type { TScenario } from '../model/types';
import { Card } from '@/shared/ui';

type TProps = {
  scenario: TScenario;
};

export function ScenarioCard({ scenario }: TProps) {
  return (
    <Card as="article" className="flex gap-3.5 text-left">
      <span aria-hidden="true" className="text-2xl">{scenario.emoji}</span>
      <div>
        <h3 className="text-[15px] font-semibold">{scenario.title}</h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">{scenario.description}</p>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { ScenarioCard } from './ui/ScenarioCard';
export type { TScenario } from './model/types';
```

- [ ] **Step 4: Commit**

```bash
git add src/05_entities/scenario
git commit -m "feat(entities/scenario): add Scenario type and ScenarioCard"
```

---

### Task 7.2: 05_entities/feature

**Files:**
- Create: `src/05_entities/feature/model/types.ts`
- Create: `src/05_entities/feature/ui/FeatureCard.tsx`
- Create: `src/05_entities/feature/index.ts`

- [ ] **Step 1: model/types.ts**

```ts
export type TFeature = {
  id: string;
  icon: 'coin' | 'check' | 'mic' | 'globe';
  title: string;
  description: string;
};
```

- [ ] **Step 2: ui/FeatureCard.tsx**

```tsx
import type { TFeature } from '../model/types';
import { Card, CheckIcon, CoinIcon } from '@/shared/ui';

type TProps = {
  feature: TFeature;
};

const iconMap = {
  coin: CoinIcon,
  check: CheckIcon,
  mic: CheckIcon,
  globe: CheckIcon,
} as const;

export function FeatureCard({ feature }: TProps) {
  const IconComponent = iconMap[feature.icon];
  return (
    <Card as="article">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-primary-pale)] text-[color:var(--color-primary)]">
        <IconComponent size={20} />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">{feature.description}</p>
    </Card>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { FeatureCard } from './ui/FeatureCard';
export type { TFeature } from './model/types';
```

- [ ] **Step 4: Commit**

```bash
git add src/05_entities/feature
git commit -m "feat(entities/feature): add Feature type and FeatureCard"
```

---

### Task 7.3: 05_entities/faq-item

**Files:**
- Create: `src/05_entities/faq-item/model/types.ts`
- Create: `src/05_entities/faq-item/ui/FaqItem.tsx`
- Create: `src/05_entities/faq-item/index.ts`

- [ ] **Step 1: model/types.ts**

```ts
export type TFaqItem = {
  id: string;
  question: string;
  answer: string;
};
```

- [ ] **Step 2: ui/FaqItem.tsx (native details/summary — a11y из коробки)**

```tsx
import type { TFaqItem } from '../model/types';

type TProps = {
  item: TFaqItem;
};

export function FaqItem({ item }: TProps) {
  return (
    <details className="group rounded-2xl border border-[color:var(--color-line)] bg-white p-5 open:shadow-[var(--shadow-mid)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]">
        {item.question}
        <span aria-hidden="true" className="text-2xl text-[color:var(--color-faint)] transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm text-[color:var(--color-muted)]">{item.answer}</p>
    </details>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { FaqItem } from './ui/FaqItem';
export type { TFaqItem } from './model/types';
```

- [ ] **Step 4: Commit**

```bash
git add src/05_entities/faq-item
git commit -m "feat(entities/faq-item): add FaqItem using native details/summary for a11y"
```

---

### Task 7.4: 03_widgets/hero

**Files:**
- Create: `src/03_widgets/hero/ui/Hero.tsx`
- Create: `src/03_widgets/hero/model/scenarios.ts`
- Create: `src/03_widgets/hero/index.ts`

> Источник: `index.html:48-167` (hero section). Адаптируем layout под mobile-first.

- [ ] **Step 1: model/scenarios.ts (заглушка)**

```ts
import type { TScenario } from '@/entities/scenario';

export const heroScenarios: TScenario[] = [
  { id: 'work', emoji: '💼', title: 'For work', description: '15 minutes a day, voice dialogues in English.' },
  { id: 'travel', emoji: '✈️', title: 'For travel', description: 'Phrases you actually use abroad.' },
  { id: 'parent', emoji: '👨‍👩‍👧', title: 'For parents', description: 'A learning track that fits between school runs.' },
  { id: 'gamer', emoji: '🎮', title: 'For gamers', description: 'Conversational practice with x2 coin bonuses.' },
];
```

- [ ] **Step 2: ui/Hero.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { ArrowRightIcon, Badge, Button, CheckIcon, Container, Section } from '@/shared/ui';
import { ScenarioCard } from '@/entities/scenario';
import { heroScenarios } from '../model/scenarios';

export async function Hero() {
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  return (
    <Section className="relative overflow-hidden pt-10 md:pt-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <Badge tone="neutral">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-primary)]" aria-hidden="true" />
              {t('heroBadge')}
            </Badge>
            <h1 className="mt-5 text-[clamp(2.2rem,5.2vw,4.1rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
              {t('heroH1')}
            </h1>
            <p className="mt-5 max-w-[560px] text-[19px] leading-[1.55] text-[color:var(--color-muted)]">
              {t('heroLead')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/waitlist">
                <Button size="lg">
                  {tc('ctaPrimary')}
                  <ArrowRightIcon size={16} />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  {tc('ctaSecondary')}
                </Button>
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-5 text-[13.5px] text-[color:var(--color-muted)]">
              {(['heroBullet1', 'heroBullet2', 'heroBullet3', 'heroBullet4'] as const).map((key) => (
                <li key={key} className="inline-flex items-center gap-1.5 font-medium">
                  <CheckIcon size={14} className="text-[color:var(--color-primary)]" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div role="group" aria-label="Scenarios">
            <ul className="grid gap-3 sm:grid-cols-2">
              {heroScenarios.map((scenario) => (
                <li key={scenario.id}>
                  <ScenarioCard scenario={scenario} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { Hero } from './ui/Hero';
```

- [ ] **Step 4: Commit**

```bash
git add src/03_widgets/hero
git commit -m "feat(widgets/hero): build hero with H1, CTAs, bullets and scenario grid"
```

---

### Task 7.5: 03_widgets/advantages-section

**Files:**
- Create: `src/03_widgets/advantages-section/model/features.ts`
- Create: `src/03_widgets/advantages-section/ui/AdvantagesSection.tsx`
- Create: `src/03_widgets/advantages-section/index.ts`

> Источник: `index.html:170-280` (примерно — adv section).

- [ ] **Step 1: model/features.ts**

```ts
import type { TFeature } from '@/entities/feature';

export const advantages: TFeature[] = [
  { id: 'coins', icon: 'coin', title: 'Earn coins for every lesson', description: 'Convert lesson coins to fiat or extend your plan.' },
  { id: 'voice', icon: 'mic', title: 'Voice dialogues', description: 'Conversation practice with feedback, not flashcards.' },
  { id: 'cefr', icon: 'check', title: 'CEFR-aligned tracks', description: 'Clear progression from A1 to C1.' },
  { id: 'languages', icon: 'globe', title: '3 languages', description: 'English, German, Norwegian — pick or switch anytime.' },
];
```

- [ ] **Step 2: ui/AdvantagesSection.tsx**

```tsx
import { Container, Section } from '@/shared/ui';
import { FeatureCard } from '@/entities/feature';
import { advantages } from '../model/features';

export function AdvantagesSection() {
  return (
    <Section id="advantages" ariaLabelledBy="advantages-heading" className="bg-white">
      <Container>
        <h2 id="advantages-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Advantages
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((feature) => (
            <li key={feature.id}>
              <FeatureCard feature={feature} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { AdvantagesSection } from './ui/AdvantagesSection';
```

- [ ] **Step 4: Commit**

```bash
git add src/03_widgets/advantages-section
git commit -m "feat(widgets/advantages): 4-feature grid backed by entities/feature"
```

---

### Task 7.6: 03_widgets/comparison-section

**Files:**
- Create: `src/03_widgets/comparison-section/model/rows.ts`
- Create: `src/03_widgets/comparison-section/ui/ComparisonSection.tsx`
- Create: `src/03_widgets/comparison-section/index.ts`

> Источник: `index.html` — секция сравнения LingoCoin vs alternatives. Делаем семантической таблицей.

- [ ] **Step 1: model/rows.ts**

```ts
export type TComparisonRow = {
  feature: string;
  speakmove: string;
  others: string;
};

export const comparisonRows: TComparisonRow[] = [
  { feature: 'Inside Telegram, no install', speakmove: 'Yes', others: 'App store install' },
  { feature: 'Earn coins → cash out', speakmove: 'Yes', others: 'No' },
  { feature: 'Voice dialogues with feedback', speakmove: 'Yes', others: 'Mostly typing' },
  { feature: 'CEFR-aligned progression', speakmove: 'Yes', others: 'Often unclear' },
  { feature: 'Daily commitment', speakmove: '15 minutes', others: '30–60 minutes' },
];
```

- [ ] **Step 2: ui/ComparisonSection.tsx**

```tsx
import { Container, Section } from '@/shared/ui';
import { comparisonRows } from '../model/rows';

export function ComparisonSection() {
  return (
    <Section id="compare" ariaLabelledBy="compare-heading">
      <Container>
        <h2 id="compare-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
          How we compare
        </h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[color:var(--color-line)] bg-white">
          <table className="w-full min-w-[600px] text-left">
            <caption className="sr-only">Feature comparison between SpeakMove and other language apps</caption>
            <thead className="bg-[color:var(--color-surface)] text-sm text-[color:var(--color-muted)]">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Feature</th>
                <th scope="col" className="px-5 py-3 font-medium">SpeakMove</th>
                <th scope="col" className="px-5 py-3 font-medium">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line)]">
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-5 py-4 text-sm font-medium">{row.feature}</th>
                  <td className="px-5 py-4 text-sm font-semibold text-[color:var(--color-primary-ink)]">{row.speakmove}</td>
                  <td className="px-5 py-4 text-sm text-[color:var(--color-muted)]">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { ComparisonSection } from './ui/ComparisonSection';
```

- [ ] **Step 4: Commit**

```bash
git add src/03_widgets/comparison-section
git commit -m "feat(widgets/comparison): semantic <table> with scope=col/row, caption, scroll on mobile"
```

---

### Task 7.7: 03_widgets/faq-section

**Files:**
- Create: `src/03_widgets/faq-section/model/items.ts`
- Create: `src/03_widgets/faq-section/ui/FaqSection.tsx`
- Create: `src/03_widgets/faq-section/index.ts`

- [ ] **Step 1: model/items.ts**

```ts
import type { TFaqItem } from '@/entities/faq-item';

export const faqItems: TFaqItem[] = [
  { id: 'how-coins', question: 'How do coins work?', answer: 'You earn coins for every completed lesson. Homework gives 2× coins. Convert to fiat or extend your plan.' },
  { id: 'languages', question: 'Which languages are supported?', answer: 'English, German, Norwegian. More are coming.' },
  { id: 'install', question: 'Do I need to install anything?', answer: 'No. SpeakMove lives entirely inside Telegram.' },
  { id: 'commitment', question: 'How much time per day?', answer: 'About 15 minutes. Lessons are short and self-contained.' },
];
```

- [ ] **Step 2: ui/FaqSection.tsx**

```tsx
import { Container, Section } from '@/shared/ui';
import { FaqItem } from '@/entities/faq-item';
import { faqItems } from '../model/items';

export function FaqSection() {
  return (
    <Section ariaLabelledBy="faq-heading" className="bg-white">
      <Container className="max-w-[820px]">
        <h2 id="faq-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Frequently asked questions
        </h2>
        <ul className="mt-8 space-y-3">
          {faqItems.map((item) => (
            <li key={item.id}>
              <FaqItem item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { FaqSection } from './ui/FaqSection';
```

- [ ] **Step 4: Commit**

```bash
git add src/03_widgets/faq-section
git commit -m "feat(widgets/faq): accordion FAQ list using native <details>"
```

---

### Task 7.8: 03_widgets/cta-section

**Files:**
- Create: `src/03_widgets/cta-section/ui/CtaSection.tsx`
- Create: `src/03_widgets/cta-section/index.ts`

- [ ] **Step 1: ui/CtaSection.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { ArrowRightIcon, Button, Container, Section } from '@/shared/ui';

export async function CtaSection() {
  const tc = await getTranslations('common');
  return (
    <Section id="cta" ariaLabelledBy="cta-heading">
      <Container className="max-w-[760px] text-center">
        <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Ready to start earning while you learn?
        </h2>
        <p className="mt-4 text-[color:var(--color-muted)]">
          Join the waitlist. We'll email you as soon as a slot opens.
        </p>
        <Link href="/waitlist" className="mt-8 inline-block">
          <Button size="lg">
            {tc('ctaPrimary')}
            <ArrowRightIcon size={16} />
          </Button>
        </Link>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { CtaSection } from './ui/CtaSection';
```

- [ ] **Step 3: Commit**

```bash
git add src/03_widgets/cta-section
git commit -m "feat(widgets/cta): bottom CTA section"
```

---

### Task 7.9: 02_pages/home

**Files:**
- Create: `src/02_pages/home/ui/HomePage.tsx`
- Create: `src/02_pages/home/index.ts`

- [ ] **Step 1: ui/HomePage.tsx**

```tsx
import { Hero } from '@/widgets/hero';
import { AdvantagesSection } from '@/widgets/advantages-section';
import { ComparisonSection } from '@/widgets/comparison-section';
import { FaqSection } from '@/widgets/faq-section';
import { CtaSection } from '@/widgets/cta-section';

export function HomePage() {
  return (
    <>
      <Hero />
      <AdvantagesSection />
      <ComparisonSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { HomePage } from './ui/HomePage';
```

- [ ] **Step 3: Commit**

```bash
git add src/02_pages/home
git commit -m "feat(pages/home): compose hero, advantages, comparison, faq, cta"
```

---

### Task 7.10: Подключить HomePage в app/[locale]/page.tsx + generateMetadata

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: app/[locale]/page.tsx**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/pages/home';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage />;
}
```

- [ ] **Step 2: Smoke**

```bash
npm run dev
```

Открой `/ru`, `/uk`, `/en`. Проверь что главная отображается полностью: hero → advantages → comparison → faq → cta. Закрой dev.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat(app): wire HomePage with generateMetadata (title, description, hreflang)"
```

---

## Phase 8 — How it works page

> Источник: `how-it-works.html` (435 строк).

### Task 8.1: 03_widgets/how-it-works-steps

**Files:**
- Create: `src/03_widgets/how-it-works-steps/model/steps.ts`
- Create: `src/03_widgets/how-it-works-steps/ui/HowItWorksSteps.tsx`
- Create: `src/03_widgets/how-it-works-steps/index.ts`

- [ ] **Step 1: model/steps.ts**

```ts
export type TStep = {
  number: number;
  title: string;
  description: string;
};

export const steps: TStep[] = [
  { number: 1, title: 'Open Telegram', description: 'No app store, no install. Tap a link, you\'re in.' },
  { number: 2, title: 'Pick your language', description: 'English, German, or Norwegian. Switch later if you want.' },
  { number: 3, title: 'Take your daily lesson', description: '15 minutes. Voice + text. You earn coins as you go.' },
  { number: 4, title: 'Cash out or extend', description: 'Convert coins to fiat or use them to extend your plan.' },
];
```

- [ ] **Step 2: ui/HowItWorksSteps.tsx**

```tsx
import { Container, Section } from '@/shared/ui';
import { steps } from '../model/steps';

export function HowItWorksSteps() {
  return (
    <Section ariaLabelledBy="hiw-heading">
      <Container>
        <h1 id="hiw-heading" className="text-4xl font-extrabold tracking-tight md:text-5xl">
          How SpeakMove works
        </h1>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-primary-pale)] font-mono text-sm font-bold text-[color:var(--color-primary)]">
                {step.number}
              </span>
              <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { HowItWorksSteps } from './ui/HowItWorksSteps';
```

- [ ] **Step 4: Commit**

```bash
git add src/03_widgets/how-it-works-steps
git commit -m "feat(widgets/how-it-works-steps): 4-step ordered list with semantic <ol>"
```

---

### Task 8.2: 02_pages/how-it-works + app/[locale]/how-it-works/page.tsx

**Files:**
- Create: `src/02_pages/how-it-works/ui/HowItWorksPage.tsx`
- Create: `src/02_pages/how-it-works/index.ts`
- Create: `app/[locale]/how-it-works/page.tsx`

- [ ] **Step 1: ui/HowItWorksPage.tsx**

```tsx
import { HowItWorksSteps } from '@/widgets/how-it-works-steps';
import { CtaSection } from '@/widgets/cta-section';

export function HowItWorksPage() {
  return (
    <>
      <HowItWorksSteps />
      <CtaSection />
    </>
  );
}
```

- [ ] **Step 2: index.ts**

```ts
export { HowItWorksPage } from './ui/HowItWorksPage';
```

- [ ] **Step 3: app/[locale]/how-it-works/page.tsx**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HowItWorksPage } from '@/pages/how-it-works';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howItWorks' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}/how-it-works`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/how-it-works`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HowItWorksPage />;
}
```

- [ ] **Step 4: Smoke**

Открой `/ru/how-it-works`, `/uk/how-it-works`, `/en/how-it-works`. Закрой dev.

- [ ] **Step 5: Commit**

```bash
git add src/02_pages/how-it-works app/[locale]/how-it-works
git commit -m "feat(pages/how-it-works): assemble page and wire route + metadata"
```

---

## Phase 9 — Pricing page

> Источник: `pricing.html` (462 строки).

### Task 9.1: 05_entities/pricing-tier

**Files:**
- Create: `src/05_entities/pricing-tier/model/types.ts`
- Create: `src/05_entities/pricing-tier/ui/PricingCard.tsx`
- Create: `src/05_entities/pricing-tier/index.ts`

- [ ] **Step 1: model/types.ts**

```ts
export type TPricingTier = {
  id: string;
  name: string;
  priceMonthly: number;
  currency: string;
  description: string;
  features: string[];
  highlight?: boolean;
  ctaHref: string;
};
```

- [ ] **Step 2: ui/PricingCard.tsx**

```tsx
import type { TPricingTier } from '../model/types';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Button, Card, CheckIcon } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  tier: TPricingTier;
  ctaLabel: string;
};

export function PricingCard({ tier, ctaLabel }: TProps) {
  return (
    <Card
      as="article"
      className={cn(
        'flex h-full flex-col p-6',
        tier.highlight && 'border-[color:var(--color-primary)] ring-2 ring-[color:var(--color-primary-pale)]',
      )}
    >
      <h3 className="text-xl font-bold">{tier.name}</h3>
      <p className="mt-1 text-sm text-[color:var(--color-muted)]">{tier.description}</p>
      <p className="mt-6 text-4xl font-extrabold">
        {tier.currency}
        {tier.priceMonthly}
        <span className="text-base font-medium text-[color:var(--color-muted)]"> / mo</span>
      </p>
      <ul className="mt-6 grow space-y-3 text-sm">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 text-[color:var(--color-primary)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={tier.ctaHref} className="mt-8">
        <Button variant={tier.highlight ? 'primary' : 'outline'} size="lg" className="w-full">
          {ctaLabel}
        </Button>
      </Link>
    </Card>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { PricingCard } from './ui/PricingCard';
export type { TPricingTier } from './model/types';
```

- [ ] **Step 4: Commit**

```bash
git add src/05_entities/pricing-tier
git commit -m "feat(entities/pricing-tier): add PricingTier type and PricingCard"
```

---

### Task 9.2: 03_widgets/pricing-table

**Files:**
- Create: `src/03_widgets/pricing-table/model/tiers.ts`
- Create: `src/03_widgets/pricing-table/ui/PricingTable.tsx`
- Create: `src/03_widgets/pricing-table/index.ts`

- [ ] **Step 1: model/tiers.ts**

```ts
import type { TPricingTier } from '@/entities/pricing-tier';

export const tiers: TPricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 7,
    currency: '$',
    description: 'Daily 15-min lessons in one language.',
    features: ['1 language', '15-min daily lesson', 'Voice dialogues', 'Coin earning'],
    ctaHref: '/waitlist',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 15,
    currency: '$',
    description: 'Unlock all languages and x2 coin homework.',
    features: ['All 3 languages', 'x2 coins on homework', 'Speaking partner sessions', 'Priority support'],
    highlight: true,
    ctaHref: '/waitlist',
  },
  {
    id: 'team',
    name: 'Team',
    priceMonthly: 39,
    currency: '$',
    description: 'For families and small teams.',
    features: ['Up to 5 accounts', 'All Pro features', 'Shared coin pool', 'Admin dashboard'],
    ctaHref: '/waitlist',
  },
];
```

- [ ] **Step 2: ui/PricingTable.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { PricingCard } from '@/entities/pricing-tier';
import { tiers } from '../model/tiers';

export async function PricingTable() {
  const tc = await getTranslations('common');
  return (
    <Section ariaLabelledBy="pricing-heading">
      <Container>
        <h1 id="pricing-heading" className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Pricing
        </h1>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <li key={tier.id}>
              <PricingCard tier={tier} ctaLabel={tc('ctaPrimary')} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: index.ts**

```ts
export { PricingTable } from './ui/PricingTable';
```

- [ ] **Step 4: Commit**

```bash
git add src/03_widgets/pricing-table
git commit -m "feat(widgets/pricing-table): 3-tier grid with highlight on Pro"
```

---

### Task 9.3: 02_pages/pricing + app/[locale]/pricing/page.tsx

**Files:**
- Create: `src/02_pages/pricing/ui/PricingPage.tsx`
- Create: `src/02_pages/pricing/index.ts`
- Create: `app/[locale]/pricing/page.tsx`

- [ ] **Step 1: PricingPage.tsx**

```tsx
import { PricingTable } from '@/widgets/pricing-table';
import { FaqSection } from '@/widgets/faq-section';
import { CtaSection } from '@/widgets/cta-section';

export function PricingPage() {
  return (
    <>
      <PricingTable />
      <FaqSection />
      <CtaSection />
    </>
  );
}
```

- [ ] **Step 2: 02_pages/pricing/index.ts**

```ts
export { PricingPage } from './ui/PricingPage';
```

- [ ] **Step 3: app/[locale]/pricing/page.tsx**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PricingPage } from '@/pages/pricing';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}/pricing`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/pricing`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingPage />;
}
```

- [ ] **Step 4: Smoke**

Открой `/ru/pricing`. Проверь что 3 карточки видны, Pro подсвечен, CTA ведёт на `/ru/waitlist`. Закрой dev.

- [ ] **Step 5: Commit**

```bash
git add src/02_pages/pricing app/[locale]/pricing
git commit -m "feat(pages/pricing): assemble pricing page with route and metadata"
```

---

## Phase 10 — Waitlist page (форма)

> Источник: `waitlist.html` (264 строки). Здесь — самая важная функциональная часть лендинга.

### Task 10.1: zod schema

**Files:**
- Create: `src/04_features/waitlist-form/model/schema.ts`

- [ ] **Step 1: schema.ts**

```ts
import { z } from 'zod';

export const WaitlistSchema = z.object({
  email: z.string().email(),
  website: z.string().optional(),
});

export type TWaitlistInput = z.infer<typeof WaitlistSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add src/04_features/waitlist-form/model/schema.ts
git commit -m "feat(waitlist-form): add zod schema and TWaitlistInput type"
```

---

### Task 10.2: types и initial state

**Files:**
- Create: `src/04_features/waitlist-form/model/types.ts`
- Create: `src/04_features/waitlist-form/model/initial-state.ts`

- [ ] **Step 1: types.ts**

```ts
import type { TWaitlistInput } from './schema';

export type TWaitlistFormState = {
  success: boolean;
  errors: string[];
  fieldErrors: Partial<Record<keyof TWaitlistInput, string[]>>;
  prev: Partial<Record<keyof TWaitlistInput, string>>;
};
```

- [ ] **Step 2: initial-state.ts**

```ts
import type { TWaitlistFormState } from './types';

export const initialState: TWaitlistFormState = {
  success: false,
  errors: [],
  fieldErrors: {},
  prev: {},
};
```

- [ ] **Step 3: Commit**

```bash
git add src/04_features/waitlist-form/model/types.ts src/04_features/waitlist-form/model/initial-state.ts
git commit -m "feat(waitlist-form): add TWaitlistFormState and initial state"
```

---

### Task 10.3: Server action

**Files:**
- Create: `src/04_features/waitlist-form/api/submit-waitlist.ts`

- [ ] **Step 1: submit-waitlist.ts**

```ts
'use server';
import { WaitlistSchema } from '../model/schema';
import type { TWaitlistFormState } from '../model/types';

const SERVER_ERROR_KEY = '__server_error__';

export async function submitWaitlist(
  _prev: TWaitlistFormState,
  formData: FormData,
): Promise<TWaitlistFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const prev: TWaitlistFormState['prev'] = {
    email: raw.email ?? '',
  };

  if (typeof raw.website === 'string' && raw.website.length > 0) {
    console.warn('[waitlist:honeypot-triggered]');
    return { success: true, errors: [], fieldErrors: {}, prev };
  }

  const parsed = WaitlistSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: [],
      fieldErrors: parsed.error.flatten().fieldErrors,
      prev,
    };
  }

  try {
    console.log('[waitlist:stub]', parsed.data);
    return { success: true, errors: [], fieldErrors: {}, prev };
  } catch (error) {
    console.error('[waitlist:server-error]', error);
    return {
      success: false,
      errors: [SERVER_ERROR_KEY],
      fieldErrors: {},
      prev,
    };
  }
}

export { SERVER_ERROR_KEY };
```

- [ ] **Step 2: Commit**

```bash
git add src/04_features/waitlist-form/api/submit-waitlist.ts
git commit -m "feat(waitlist-form): add server action with honeypot, zod validation, error logging"
```

---

### Task 10.4: SuccessBlock

**Files:**
- Create: `src/04_features/waitlist-form/ui/SuccessBlock.tsx`

- [ ] **Step 1: SuccessBlock.tsx**

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { CheckIcon } from '@/shared/ui';

export function SuccessBlock() {
  const t = useTranslations('waitlist.form');
  return (
    <div role="status" className="rounded-2xl border border-[color:var(--color-primary)] bg-[color:var(--color-primary-pale)] p-6 text-[color:var(--color-primary-ink)]">
      <div className="flex items-start gap-3">
        <CheckIcon size={24} className="mt-0.5 text-[color:var(--color-primary)]" label="Success" />
        <div>
          <h2 className="text-lg font-bold">{t('successTitle')}</h2>
          <p className="mt-1 text-sm">{t('successBody')}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/04_features/waitlist-form/ui/SuccessBlock.tsx
git commit -m "feat(waitlist-form): add SuccessBlock with role=status"
```

---

### Task 10.5: WaitlistForm UI

**Files:**
- Create: `src/04_features/waitlist-form/ui/WaitlistForm.tsx`
- Create: `src/04_features/waitlist-form/index.ts`

- [ ] **Step 1: WaitlistForm.tsx**

```tsx
'use client';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, FieldError, HoneypotField, Input, Label } from '@/shared/ui';
import { submitWaitlist, SERVER_ERROR_KEY } from '../api/submit-waitlist';
import { initialState } from '../model/initial-state';
import { SuccessBlock } from './SuccessBlock';

export function WaitlistForm() {
  const t = useTranslations('waitlist.form');
  const [state, formAction, pending] = useActionState(submitWaitlist, initialState);

  if (state.success) return <SuccessBlock />;

  const formErrors = state.errors.map((key) => (key === SERVER_ERROR_KEY ? t('serverError') : key));
  const formErrorId = formErrors.length > 0 ? 'waitlist-form-errors' : undefined;
  const emailErrorId = state.fieldErrors.email && state.fieldErrors.email.length > 0 ? 'email-error' : undefined;

  return (
    <form
      action={formAction}
      noValidate
      aria-busy={pending}
      aria-describedby={formErrorId}
      className="space-y-4"
    >
      <HoneypotField name="website" label={t('honeypotLabel')} />

      <FieldError id={formErrorId} errors={formErrors} />

      <div>
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t('emailPlaceholder')}
          defaultValue={state.prev.email}
          invalid={Boolean(state.fieldErrors.email?.length)}
          aria-describedby={emailErrorId}
          className="mt-1"
        />
        <FieldError id={emailErrorId} errors={state.fieldErrors.email} />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? t('submitting') : t('submit')}
      </Button>

      <div role="status" aria-live="polite" className="sr-only">
        {pending ? t('submitting') : ''}
      </div>
    </form>
  );
}
```

- [ ] **Step 2: 04_features/waitlist-form/index.ts**

```ts
export { WaitlistForm } from './ui/WaitlistForm';
```

- [ ] **Step 3: Commit**

```bash
git add src/04_features/waitlist-form/ui/WaitlistForm.tsx src/04_features/waitlist-form/index.ts
git commit -m "feat(waitlist-form): add form UI with useActionState, a11y wiring, defaultValue restoration"
```

---

### Task 10.6: 02_pages/waitlist + app/[locale]/waitlist/page.tsx

**Files:**
- Create: `src/02_pages/waitlist/ui/WaitlistPage.tsx`
- Create: `src/02_pages/waitlist/index.ts`
- Create: `app/[locale]/waitlist/page.tsx`

- [ ] **Step 1: WaitlistPage.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { WaitlistForm } from '@/features/waitlist-form';

export async function WaitlistPage() {
  const t = await getTranslations('waitlist');
  return (
    <Section>
      <Container className="max-w-[520px]">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-[color:var(--color-muted)]">{t('description')}</p>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: 02_pages/waitlist/index.ts**

```ts
export { WaitlistPage } from './ui/WaitlistPage';
```

- [ ] **Step 3: app/[locale]/waitlist/page.tsx**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { WaitlistPage } from '@/pages/waitlist';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'waitlist' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}/waitlist`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/waitlist`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WaitlistPage />;
}
```

- [ ] **Step 4: Smoke test всех сценариев формы**

```bash
npm run dev
```

Сценарии:
1. Открой `/ru/waitlist`. Введи `not-an-email` → submit → красная ошибка под input'ом, фокус не сбрасывается, значение остаётся.
2. Введи валидный email → submit → появляется `<SuccessBlock />`.
3. Открой DevTools → Elements → найди honeypot input → введи в него через JS `document.getElementById('website').value = 'spam'` → submit формы → silent success.
4. Tab по форме — фокус виден на input → submit button.

Закрой dev server.

- [ ] **Step 5: Commit**

```bash
git add src/02_pages/waitlist app/[locale]/waitlist
git commit -m "feat(pages/waitlist): assemble waitlist page with form and metadata"
```

---

## Phase 11 — Privacy page

### Task 11.1: 02_pages/privacy + app/[locale]/privacy/page.tsx

**Files:**
- Create: `src/02_pages/privacy/ui/PrivacyPage.tsx`
- Create: `src/02_pages/privacy/index.ts`
- Create: `app/[locale]/privacy/page.tsx`

> Источник: `privacy.html` (236 строк). Текст — заглушка с базовой структурой; реальный юридический текст добавим позже от заказчика.

- [ ] **Step 1: PrivacyPage.tsx**

```tsx
import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';

export async function PrivacyPage() {
  const t = await getTranslations('privacy');
  return (
    <Section>
      <Container className="max-w-[720px]">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h1>
        <div className="prose mt-8 max-w-none text-[color:var(--color-muted)] [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[color:var(--color-ink)] [&_p]:mt-3">
          <p>{t('description')}</p>
          <h2>1. What data we collect</h2>
          <p>Placeholder. We will replace this with the real policy text before launch.</p>
          <h2>2. How we use it</h2>
          <p>Placeholder.</p>
          <h2>3. Your rights</h2>
          <p>Placeholder.</p>
          <h2>4. Contact</h2>
          <p>Placeholder.</p>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: 02_pages/privacy/index.ts**

```ts
export { PrivacyPage } from './ui/PrivacyPage';
```

- [ ] **Step 3: app/[locale]/privacy/page.tsx**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PrivacyPage } from '@/pages/privacy';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}/privacy`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/privacy`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyPage />;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/02_pages/privacy app/[locale]/privacy
git commit -m "feat(pages/privacy): placeholder privacy policy with metadata"
```

---

## Phase 12 — SEO finalization

### Task 12.1: app/sitemap.ts

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: sitemap.ts**

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/shared/model/libs/i18n/routing';
import { env } from '@/shared/model/libs/env';

const paths = ['', '/how-it-works', '/pricing', '/waitlist', '/privacy'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    })),
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(seo): add sitemap.ts covering all locales × pages with hreflang"
```

---

### Task 12.2: app/robots.ts

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1: robots.ts**

```ts
import type { MetadataRoute } from 'next';
import { env } from '@/shared/model/libs/env';

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/robots.ts
git commit -m "feat(seo): add robots.ts with sitemap reference"
```

---

### Task 12.3: app/opengraph-image.tsx (заглушка)

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1: opengraph-image.tsx**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SpeakMove';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
          color: 'white',
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: '-0.025em',
        }}
      >
        SpeakMove
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/opengraph-image.tsx
git commit -m "feat(seo): add default opengraph-image placeholder"
```

---

### Task 12.4: Глобальный layout с базовыми metadataBase

**Files:**
- Create: `app/layout.tsx` (root layout — для корректной работы global-error и метаданных)

> Next.js требует root layout для корректной работы. Но `app/[locale]/layout.tsx` уже задаёт `<html>`/`<body>` — поэтому root layout должен быть минимальным pass-through. Проблема: Next.js не может корректно скомбинировать. На самом деле корневой `<html>`/`<body>` живёт в `[locale]/layout.tsx`, и Next допускает отсутствие корневого `layout.tsx` если используется `[locale]` group с `<html>` внутри. Проверяем: если `next build` падает с ошибкой про отсутствие root layout — добавим минимальный pass-through. Для metadataBase используем metadata в `[locale]/layout.tsx`.

- [ ] **Step 1: Добавить metadataBase в `app/[locale]/layout.tsx`**

Обновить layout — добавить export metadata над `LocaleLayout`:

```tsx
// добавить после import'ов:
import type { Metadata } from 'next';
import { env } from '@/shared/model/libs/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
};
```

- [ ] **Step 2: Build, проверяем что root layout не требуется**

```bash
npm run build
```

Если падает с ошибкой про root layout — создать `app/layout.tsx`:

```tsx
import type { PropsWithChildren } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  return children;
}
```

Это pass-through; настоящий `<html>` ставит `[locale]/layout.tsx`.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/layout.tsx app/layout.tsx 2>/dev/null || git add app/[locale]/layout.tsx
git commit -m "feat(seo): add metadataBase from env to enable absolute OG URLs"
```

---

## Phase 13 — Acceptance verification

### Task 13.1: Lint + typecheck + build clean

- [ ] **Step 1: Lint**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings. Если есть — починить (это означает что код нарушает правила, см. spec §9).

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected:
- Build completes without errors.
- Output показывает что все маршруты `[locale]/(*)/page` помечены как `(SSG)` или `Static`.
- Никаких warning'ов про missing setRequestLocale.

- [ ] **Step 4: grep на запрещённые паттерны**

```bash
grep -rE "React\." src app | grep -v "^Binary" || echo "OK: no React.* usages"
grep -rE "forwardRef" src app | grep -v "^Binary" || echo "OK: no forwardRef usages"
grep -rE "\binterface\s+T?[A-Z]" src app || echo "OK: no interface declarations"
```

Expected: всё "OK: ...".

---

### Task 13.2: Manual smoke в браузере

- [ ] **Step 1: Запустить prod build локально**

```bash
npm run start
```

Открой http://localhost:3000.

- [ ] **Step 2: Routing checks**

- `/` → 308 на `/ru` ✓
- `/ru`, `/uk`, `/en` → главная рендерится ✓
- `/ru/how-it-works`, `/uk/how-it-works`, `/en/how-it-works` ✓
- `/ru/pricing`, `/uk/pricing`, `/en/pricing` ✓
- `/ru/waitlist`, `/uk/waitlist`, `/en/waitlist` ✓
- `/ru/privacy`, `/uk/privacy`, `/en/privacy` ✓
- `/ru/does-not-exist` → локализованная 404 ✓
- `/zz` → 404 ✓
- LocaleSwitch на любой странице сохраняет текущий путь ✓

- [ ] **Step 3: Форма waitlist (повторить из Task 10.6)**

- Невалидный email → ошибка под полем, значение сохраняется ✓
- Валидный email → SuccessBlock ✓
- Honeypot → silent success ✓

- [ ] **Step 4: A11y проверки**

- Tab после загрузки → виден SkipLink ✓
- Включить prefers-reduced-motion (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce) → анимации/transitions отключены ✓
- В каждой странице ровно один `<h1>` (DevTools → Elements → `document.querySelectorAll('h1').length` должно быть `1`) ✓
- Кнопки с одной только иконкой имеют `aria-label` (SiteHeader CTA имеет текст, поэтому проверка минимальна).

- [ ] **Step 5: Mobile 375px**

DevTools → Responsive → 375×667.
- Нет горизонтального скролла на главной ✓
- Все CTA-кнопки ≥ 44px высотой ✓
- Текст читается без zoom ✓
- LocaleSwitch скрыт в header (per design), CTA остаётся ✓

- [ ] **Step 6: Lighthouse a11y**

DevTools → Lighthouse → Accessibility only, Mobile.
Expected: ≥ 95.

Если меньше — исследовать и пофиксить контраст / ARIA-метки.

- [ ] **Step 7: Остановить prod server**

Ctrl+C.

- [ ] **Step 8: Если все проверки пройдены — финальный коммит-тег**

```bash
git tag -a v0.1.0 -m "Initial SpeakMove landing — Next.js 16 + FSD + next-intl"
```

(Тег локальный; пуш по решению пользователя.)

---

## Self-Review (выполняется после написания плана)

Прошёлся по spec и сверил с планом:

| Spec § | Что в плане |
|---|---|
| §2 Стек | Phase 0 (deps + configs) |
| §3 Структура папок | Все task'и создают именно эти файлы |
| §4 Маршрутизация + 404/500 + [...rest] | Phase 4.3, 4.4 |
| §5 i18n routing/request/navigation | Phase 1.3–1.8 |
| §6 Форма waitlist (типы, action, UI, a11y) | Phase 10 целиком |
| §7 Tailwind токены в globals.css | Task 0.6 |
| §8 Env @t3-oss | Task 1.2 |
| §9 Соглашения (T-префикс, no React.*, no forwardRef, PropsWithChildren) | ESLint config в Task 0.3 + acceptance grep в 13.1.4 |
| §10 Headers | Task 0.5 |
| §11 A11y per-component | Применено в shared/ui (Phase 2), widgets (Phase 6, 7), формы (Phase 10) |
| §12 SEO | Phase 12 + generateMetadata в каждой page.tsx |
| §13 Out of scope | Соблюдён — никаких dark mode, аналитики, реального backend, тестов |
| §15 Acceptance criteria | Phase 13 |

Placeholder scan: запрещённых паттернов в плане нет — каждый шаг показывает конкретный код. Текстовые тексты в JSON-словарях — placeholder'ы по дизайну (real copy ждём от заказчика, см. spec §1).

Type consistency: `TWaitlistFormState`, `TWaitlistInput`, `TLocale`, `TMessages`, `TScenario`, `TFeature`, `TFaqItem`, `TPricingTier`, `TComparisonRow`, `TStep` — все используются единообразно между task'ами.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-13-speakmove-landing.md`. Two execution options:

1. **Subagent-Driven (recommended)** — я запускаю свежий subagent на каждую задачу, ревью между задачами, быстрая итерация. Хорошо подходит для длинных планов.

2. **Inline Execution** — выполняю задачи в этой же сессии через `executing-plans`, батч-выполнение с чекпойнтами для ревью.

Which approach?
