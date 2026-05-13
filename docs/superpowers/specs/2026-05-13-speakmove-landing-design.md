# SpeakMove Landing — миграция на Next.js 16 + FSD

Дата: 2026-05-13
Статус: утверждено

## 1. Контекст и цели

Существующий статический HTML-сайт LingoCoin (9 страниц, ~4000 строк, Tailwind v4 через CDN) переносим в production-репозиторий `speakmove-landing` со сменой бренда на **SpeakMove**. Технический стек — Next.js 16 (App Router, RSC, TypeScript strict), TailwindCSS v4, next-intl. Архитектура — Feature-Sliced Design с нумерованными префиксами для упорядоченного отображения слоёв в IDE.

**Источник:** `/Users/dmitriy/Desktop/mvp/01_lingocoin/html/`
**Цель:** `/Users/dmitriy/Documents/GitHub/speakmove-landing/`

Метатеги и тексты — заглушки, заменим позже по мере получения копирайта от заказчика.

## 2. Стек

| Слой | Выбор |
|------|-------|
| Framework | Next.js 16, App Router, RSC по умолчанию |
| Language | TypeScript strict + `noUncheckedIndexedAccess` |
| Styling | TailwindCSS v4 (CSS-first, `@theme` в `globals.css`, без `tailwind.config.js`) |
| i18n | `next-intl` v4+ с sub-path routing `/ru` (default), `/uk`, `/en` |
| Routing boundary | `proxy.ts` (Next.js 16 заменил `middleware.ts`) |
| Forms | React 19 `useActionState` + Server Action + zod + honeypot |
| Env | `@t3-oss/env-nextjs` + zod |
| Fonts | `next/font/google` self-hosted: Inter + JetBrains Mono |
| Package manager | npm |
| Linters | ESLint flat config (next + jsx-a11y) + Prettier + prettier-plugin-tailwindcss |
| Theme | Только светлая, без infra под dark |
| Analytics | Нет (на старте) |
| Brand | SpeakMove (логотип — собственный React-компонент) |

## 3. Структура папок

> FSD-слой `01_app` физически реализован как `app/` в корне — это требование Next.js 16 (имя каталога App Router не настраивается). Остальные слои в `src/` с численными префиксами `02_pages`, `03_widgets`, `04_features`, `05_entities`, `06_shared`.

```
speakmove-landing/
├── app/                                       # Next.js App Router (FSD 01_app)
│   ├── [locale]/
│   │   ├── layout.tsx                          # html + body + NextIntlClientProvider
│   │   ├── page.tsx                            → 02_pages/home
│   │   ├── how-it-works/page.tsx               → 02_pages/how-it-works
│   │   ├── pricing/page.tsx                    → 02_pages/pricing
│   │   ├── waitlist/page.tsx                   → 02_pages/waitlist
│   │   ├── privacy/page.tsx                    → 02_pages/privacy
│   │   ├── not-found.tsx                       # 404 ВНУТРИ локали (с переводами)
│   │   ├── error.tsx                           # 500/runtime errors per-locale ('use client')
│   │   └── [...rest]/page.tsx                  # catch-all → notFound()
│   ├── not-found.tsx                           # глобальный fallback для URL без локали ('use client')
│   ├── global-error.tsx                        # критическая ошибка root-уровня ('use client')
│   ├── globals.css                             # Tailwind v4 + @theme tokens
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx
├── messages/                                   # next-intl
│   ├── ru.json
│   ├── uk.json
│   └── en.json
├── proxy.ts                                    # next-intl createMiddleware → export proxy
├── next.config.ts                              # withNextIntl + security headers
├── postcss.config.mjs                          # @tailwindcss/postcss
├── eslint.config.mjs
├── prettier.config.mjs
├── tsconfig.json                               # path aliases
├── .env.example
├── package.json
├── public/                                     # статика: логотипы из HTML, og-images
└── src/
    ├── 02_pages/                               # page-композиции (тонкие, RSC)
    │   ├── home/ui/HomePage.tsx
    │   ├── how-it-works/ui/HowItWorksPage.tsx
    │   ├── pricing/ui/PricingPage.tsx
    │   ├── waitlist/ui/WaitlistPage.tsx
    │   ├── privacy/ui/PrivacyPage.tsx
    │   ├── not-found/ui/NotFoundPage.tsx       # импортируется в [locale]/not-found.tsx
    │   └── error/ui/ErrorPage.tsx              # импортируется в [locale]/error.tsx
    ├── 03_widgets/
    │   ├── site-header/                         # навбар + LocaleSwitch
    │   ├── site-footer/
    │   ├── hero/
    │   ├── advantages-section/
    │   ├── comparison-section/
    │   ├── faq-section/
    │   ├── cta-section/
    │   ├── pricing-table/
    │   └── how-it-works-steps/
    ├── 04_features/
    │   ├── waitlist-form/
    │   │   ├── api/submit-waitlist.ts          # 'use server'
    │   │   ├── model/schema.ts                  # zod
    │   │   ├── model/types.ts                   # TWaitlistFormState, TWaitlistInput
    │   │   ├── model/initial-state.ts
    │   │   ├── ui/WaitlistForm.tsx              # 'use client', useActionState
    │   │   └── ui/SuccessBlock.tsx              # рендерится при state.success
    │   └── locale-switch/ui/LocaleSwitch.tsx
    ├── 05_entities/
    │   ├── brand/
    │   │   ├── ui/Logo.tsx                      # текстовый логотип SpeakMove
    │   │   └── ui/BrandCoin.tsx                 # бэйдж "SM"/монета
    │   ├── pricing-tier/
    │   │   ├── ui/PricingCard.tsx
    │   │   └── model/types.ts                   # TPricingTier
    │   ├── feature/
    │   │   ├── ui/FeatureCard.tsx
    │   │   └── model/types.ts                   # TFeature
    │   ├── scenario/
    │   │   ├── ui/ScenarioCard.tsx
    │   │   └── model/types.ts                   # TScenario
    │   └── faq-item/
    │       ├── ui/FaqItem.tsx
    │       └── model/types.ts                   # TFaqItem
    └── 06_shared/
        ├── ui/
        │   ├── Button/
        │   ├── Input/
        │   ├── Label/
        │   ├── FieldError/                      # рендерит string | string[] (булеты)
        │   ├── HoneypotField/
        │   ├── Container/
        │   ├── Section/
        │   ├── Badge/
        │   ├── Card/
        │   ├── Icon/                            # инлайн-SVG
        │   ├── VisuallyHidden/
        │   └── SkipLink/
        └── model/
            ├── hooks/                            # useMediaQuery, useReducedMotion
            ├── utils/                            # format.ts
            └── libs/
                ├── cn/                            # clsx + tailwind-merge
                ├── env/                           # @t3-oss/env-nextjs
                └── i18n/
                    ├── routing.ts                # defineRouting + createNavigation
                    ├── request.ts                # getRequestConfig (server-only)
                    ├── navigation.ts             # re-export locale-aware Link/useRouter/...
                    └── types.ts                  # TLocale, TMessages
```

### Path aliases (tsconfig)

```jsonc
{
  "paths": {
    "@/pages/*": ["./src/02_pages/*"],
    "@/widgets/*": ["./src/03_widgets/*"],
    "@/features/*": ["./src/04_features/*"],
    "@/entities/*": ["./src/05_entities/*"],
    "@/shared/*": ["./src/06_shared/*"]
  }
}
```

Папка `app/` своими импортами почти не пользуется (тонкие page-ы, делегирующие в `@/pages/*`), поэтому aliasу для неё не требуется.

## 4. Маршрутизация и обработка ошибок

### Перенос страниц

| Источник HTML | Маршрут | FSD-страница |
|---------------|---------|--------------|
| `index.html` | `/[locale]` | `02_pages/home` |
| `how-it-works.html` | `/[locale]/how-it-works` | `02_pages/how-it-works` |
| `pricing.html` | `/[locale]/pricing` | `02_pages/pricing` |
| `waitlist.html` | `/[locale]/waitlist` | `02_pages/waitlist` |
| `welcome-waitlist.html` | — (исключено) | состояние внутри `waitlist-form` |
| `thank-you.html` | — (исключено) | success-состояние формы `<SuccessBlock />` |
| `privacy.html` | `/[locale]/privacy` | `02_pages/privacy` |
| `404.html` | `[locale]/not-found.tsx` + `[...rest]/page.tsx` + `app/not-found.tsx` | `02_pages/not-found` |
| `cookie-banner-demo.html` | — (исключено) | — |

### Логика 404/500 (по примеру next-intl/example-app-router-playground)

- `app/not-found.tsx` (глобальный, `'use client'`) — fallback для URL, которые НЕ подцепил proxy (т.е. без локали). Просто `<Error statusCode={404} />` из `next/error`. Без переводов — это технический fallback.
- `app/[locale]/[...rest]/page.tsx` — catch-all для всего внутри локали, что не совпало с конкретными путями. Вызывает `notFound()`.
- `app/[locale]/not-found.tsx` — переведённая 404 страница (рендерит `NotFoundPage` из `02_pages/not-found`). Сюда приходит юзер из catch-all.
- `app/[locale]/error.tsx` (`'use client'`) — runtime-ошибки внутри локали (рендерит `ErrorPage` из `02_pages/error`).
- `app/global-error.tsx` (`'use client'`) — критическая ошибка root-уровня.

## 5. i18n (next-intl)

### Установка и конфиг

```ts
// src/06_shared/model/libs/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ru', 'uk', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',          // все URL содержат /ru, /uk, /en
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

```ts
// src/06_shared/model/libs/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
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

```ts
// src/06_shared/model/libs/i18n/types.ts
import type { routing } from './routing';
import type ruMessages from '../../../../../messages/ru.json';

export type TLocale = (typeof routing.locales)[number];
export type TMessages = typeof ruMessages;
```

```ts
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/06_shared/model/libs/i18n/request.ts');

const config: NextConfig = {
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

```ts
// proxy.ts (в корне; Next.js 16 file convention)
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/shared/model/libs/i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

### Layout и static rendering

```tsx
// app/[locale]/layout.tsx
import type { PropsWithChildren } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';

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

В каждой странице ОБЯЗАТЕЛЬНО первым вызывать `setRequestLocale(locale)` перед использованием `useTranslations`/`getTranslations` — это включает static rendering.

### Метаданные и SEO

- `generateMetadata` в каждой `page.tsx` использует `getTranslations` + `alternates.languages` для hreflang.
- `app/sitemap.ts` генерит URL × локали.
- proxy автоматически инжектит `Link` headers с `hreflang` (без ручной работы).

## 6. Форма waitlist

### Типы

```ts
// src/04_features/waitlist-form/model/schema.ts
import { z } from 'zod';

export const WaitlistSchema = z.object({
  email: z.string().email(),
  // scenario, language, etc. — добавим по мере определения копирайта
  website: z.string().optional(),   // honeypot
});

export type TWaitlistInput = z.infer<typeof WaitlistSchema>;
```

```ts
// src/04_features/waitlist-form/model/types.ts
import type { TWaitlistInput } from './schema';

export type TWaitlistFormState = {
  success: boolean;
  errors: string[];                                           // общие (server/network)
  fieldErrors: Partial<Record<keyof TWaitlistInput, string[]>>;
  prev: Partial<Record<keyof TWaitlistInput, string>>;        // для defaultValue
};
```

```ts
// src/04_features/waitlist-form/model/initial-state.ts
import type { TWaitlistFormState } from './types';

export const initialState: TWaitlistFormState = {
  success: false,
  errors: [],
  fieldErrors: {},
  prev: {},
};
```

### Server Action

```ts
// src/04_features/waitlist-form/api/submit-waitlist.ts
'use server';
import { WaitlistSchema } from '../model/schema';
import type { TWaitlistFormState } from '../model/types';

export async function submitWaitlist(
  _prev: TWaitlistFormState,
  formData: FormData,
): Promise<TWaitlistFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const prev: TWaitlistFormState['prev'] = {
    email: raw.email ?? '',
  };

  // honeypot — silent success
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
    // STUB: пока просто логируем. TODO: подключить реальный бэкенд.
    console.log('[waitlist:stub]', parsed.data);
    return { success: true, errors: [], fieldErrors: {}, prev };
  } catch (error) {
    // детали — только в лог, юзеру — обобщённое сообщение из словаря
    console.error('[waitlist:server-error]', error);
    return {
      success: false,
      errors: ['__server_error__'],   // ключ переводится в UI
      fieldErrors: {},
      prev,
    };
  }
}
```

### UI

```tsx
// src/04_features/waitlist-form/ui/WaitlistForm.tsx
'use client';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { FieldError } from '@/shared/ui/FieldError';
import { HoneypotField } from '@/shared/ui/HoneypotField';
import { submitWaitlist } from '../api/submit-waitlist';
import { initialState } from '../model/initial-state';

export function WaitlistForm() {
  const t = useTranslations('waitlist.form');
  const [state, formAction, pending] = useActionState(submitWaitlist, initialState);

  if (state.success) return <SuccessBlock />;

  const formErrors = state.errors.map((key) => (key === '__server_error__' ? t('serverError') : key));
  const formErrorId = formErrors.length ? 'waitlist-form-errors' : undefined;

  return (
    <form
      action={formAction}
      noValidate
      aria-busy={pending}
      aria-describedby={formErrorId}
    >
      <HoneypotField name="website" />
      <FieldError id={formErrorId} errors={formErrors} />

      <div>
        <Label htmlFor="email">{t('email.label')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.prev.email}
          aria-invalid={Boolean(state.fieldErrors.email?.length)}
          aria-describedby={state.fieldErrors.email?.length ? 'email-error' : undefined}
        />
        <FieldError id="email-error" errors={state.fieldErrors.email} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? t('submitting') : t('submit')}
      </Button>

      <div role="status" aria-live="polite" className="sr-only">
        {pending ? t('submitting') : ''}
      </div>
    </form>
  );
}
```

### A11y-цепочка

- `<form aria-busy={pending} aria-describedby="waitlist-form-errors">` — общая серверная ошибка связана с формой.
- `<input aria-invalid aria-describedby="email-error">` — поле-специфичная связь.
- `<FieldError role="alert">` — screen reader озвучивает при появлении.
- `<div role="status" aria-live="polite">` — статус отправки (sr-only).
- `defaultValue={state.prev.email}` — значения восстанавливаются при ошибке.

### FieldError компонент

```tsx
// src/06_shared/ui/FieldError/FieldError.tsx
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
      <p id={id} role="alert" className={cn('text-sm text-red-600 mt-1', className)}>
        {list[0]}
      </p>
    );
  }
  return (
    <ul id={id} role="alert" className={cn('text-sm text-red-600 mt-1 pl-5 list-disc space-y-0.5', className)}>
      {list.map((err, i) => <li key={`${err}-${i}`}>{err}</li>)}
    </ul>
  );
}
```

## 7. Tailwind v4 — токены

`app/globals.css`:

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
}
```

Шрифты — через `next/font/google` в `app/[locale]/layout.tsx`, CSS-переменные `--font-inter` и `--font-jetbrains` пробрасываются в `<html>` через `className`.

Кастомные классы из `styles.css` (~370 строк) переводим в:
- Базовые токены → `@theme`.
- Утилитарные классы (`btn`, `btn-primary`, `nav`, и т.д.) → в `@layer components` либо переписываем как Tailwind-классы прямо в компонентах `shared/ui` (предпочтительно).
- `.brand-coin`, `.lang-toggle`, `.hero-bg-grid` → в локальные стили компонентов через `className`.

## 8. Env (@t3-oss/env-nextjs)

```ts
// src/06_shared/model/libs/env/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // Заготовки под бэкенд формы (заполним когда подключим)
    // RESEND_API_KEY: z.string().optional(),
    // WAITLIST_WEBHOOK_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
```

`.env.example` (значения пустые — заполняются разработчиком локально и в проде):
```
NEXT_PUBLIC_SITE_URL=
```

## 9. Соглашения по коду

### Типы
- **Только `type`, без `interface`.**
- **Все именованные типы — с префиксом `T`** (`TLocale`, `TWaitlistFormState`, `TPricingTier`, `TProps`, и т.д.).
  - Generic-параметры остаются как `T`, `U`, `K`, `V` (это разные кейсы).
  - Enforce через ESLint `@typescript-eslint/naming-convention`.
- TypeScript `strict: true` + `noUncheckedIndexedAccess: true`.

### React 19 идиомы
- **Не использовать `React.*` префикс** — всё импортируется явно из `react` для лучшего bundle splitting и tree-shaking:
  - `React.ReactNode` → `import type { ReactNode } from 'react'`
  - `React.FC` — вообще не используем
  - `React.useState` → `import { useState } from 'react'`
- **`PropsWithChildren` вместо ручного `children: ReactNode`** в типах пропсов:
  ```ts
  import type { PropsWithChildren } from 'react';
  type TProps = PropsWithChildren<{ variant?: 'primary' | 'secondary' }>;
  ```
- **Не использовать `forwardRef`** — в React 19 `ref` это обычный проп:
  ```tsx
  // ❌ старо
  const Button = forwardRef<HTMLButtonElement, TProps>((props, ref) => ...);

  // ✅ React 19
  type TProps = ComponentPropsWithRef<'button'> & { variant?: 'primary' };
  export function Button({ ref, variant, ...rest }: TProps) {
    return <button ref={ref} {...rest} />;
  }
  ```
- **Server Components по умолчанию** — `'use client'` ставим только когда нужны hooks, event handlers, или browser-only API.

### FSD
- Mobile-first: все стили начинаются от мобильных, `sm:`/`md:`/`lg:`/`xl:` для desktop.
- Public API слоя FSD — только через index-файлы (`src/04_features/waitlist-form/index.ts` реэкспортит `WaitlistForm`).
- Импорты НЕ пересекают слои наверх: `entities` не импортирует `widgets`, и т.д. (стандартное FSD-правило).

## 10. Безопасность

- **Server actions:** все входные данные валидируются zod на сервере; не доверяем клиенту.
- **Honeypot:** скрытое поле `website`, visually-hidden, `tabindex={-1}`, `autoComplete="off"`, контейнер с `aria-hidden`. Если заполнено — silent success.
- **Headers** (next.config.ts): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. CSP — добавим позже, когда определимся со списком внешних доменов.
- **Env:** валидируется на сборке через `@t3-oss/env-nextjs`. `.env` не коммитится, `.env.example` коммитится.
- **Логи ошибок:** на сервер выводим детали через `console.error`, юзеру отдаём обобщённое сообщение.
- **Зависимости:** минимум сторонних библиотек; зафиксированные версии в `package.json`.

## 11. A11y

**Базовое правило:** каждый интерактивный элемент (кнопка, ссылка, поле, открывающийся блок) и каждый layout-блок (landmark, секция) должен иметь полный набор a11y-атрибутов «из коробки» через `shared/ui`. Это не опциональный полишинг — это контракт компонентов.

### Интерактивные компоненты `shared/ui`

| Компонент | Базовые требования |
|---|---|
| **Button** | `type="button"` по умолчанию; `focus-visible:outline-2 outline-offset-2`; `disabled:opacity-50 disabled:cursor-not-allowed`; поддержка `aria-busy`, `aria-pressed` (для toggle), `aria-expanded` (для disclosure); если внутри только иконка — обязательный `aria-label`; min-height 44px на мобайле (WCAG 2.5.5). |
| **LinkButton / визуально-кнопка-ссылка** | Семантически `<a>` если ведёт на URL, `<button>` если триггерит действие. Внешние ссылки (`target="_blank"`) → обязательно `rel="noopener noreferrer"` + визуальная или `aria-label` подсказка «открывается в новой вкладке». |
| **Link (next-intl `<Link>`)** | `aria-current="page"` для активной страницы в навигации; locale-aware из `createNavigation(routing)`. |
| **Input** | Связан с `<Label htmlFor>` (всегда); `aria-invalid` при ошибке; `aria-describedby` ссылается на `FieldError` и/или hint; `autoComplete` всегда явно указан (например `email`, `name`, `off`); `inputMode` для числовых/телефонных полей. |
| **Label** | `htmlFor` обязателен в типах (required prop). Невидимые лейблы — через `<VisuallyHidden>`, не через `placeholder`. |
| **FieldError** | `role="alert"`, рендерит `string \| string[]` (массив — `<ul>` с буллетами). |
| **HoneypotField** | Контейнер `aria-hidden="true"`, поле `tabIndex={-1}` + `autoComplete="off"`, визуально скрыто через `clip-path` (не `display:none` — Chrome иначе пропускает поле). |
| **Card / FeatureCard / PricingCard / ScenarioCard** | Если карточка кликабельна целиком — оборачиваем во вложенный `<a>` с растяжимой зоной нажатия (`::after` overlay). Если внутри есть несколько действий — карточка не кликабельна, только конкретные элементы. Не нарушаем правило вложенности интерактивных элементов (`<a>` внутри `<a>`). |
| **FaqItem (accordion)** | Используем нативный `<details>/<summary>` (a11y из коробки) ИЛИ свой паттерн с `aria-expanded`, `aria-controls`, `id` на панели. Клавиатура: Enter/Space раскрывает, Escape закрывает (если кастомный). |
| **LocaleSwitch** | `<nav aria-label="Language">` обёртка; элементы — `<Link>` (не `<button>`) с атрибутами `hreflang={locale}` и `lang={locale}` (родной язык названия — «Українська», «English», «Русский»); активная локаль — `aria-current="true"`. |
| **SkipLink** | `<a href="#main">` первым элементом `<body>`; visible only on focus (`sr-only focus:not-sr-only`); прыгает на `<main id="main">`. |
| **Modal / Dialog (если появится)** | Нативный `<dialog>` с focus trap из браузера, или ARIA dialog pattern с `aria-modal`, `aria-labelledby`, восстановление фокуса после закрытия. |

### Layout и навигация

- `<main id="main">` — единственный landmark на странице.
- `<header>`, `<footer>`, `<nav>` — семантически правильные landmarks; у нескольких `<nav>` обязательны `aria-label`.
- Иерархия заголовков: ровно один `<h1>` на страницу, далее `<h2>` для секций, `<h3>` для подсекций. Пропускать уровни нельзя.
- `lang` атрибут на `<html>` ставится из `params.locale`.

### Motion и контраст

- `prefers-reduced-motion` — респектится во всех анимациях через `useReducedMotion` хук + `motion-safe:`/`motion-reduce:` утилиты Tailwind.
- Контраст AA — токены подобраны от исходника (зелёный #047857 на белом проходит AA для текста ≥14pt). Любые новые цвета проверяем через WebAIM contrast checker.
- Никакой информации только через цвет — статусы/ошибки всегда сопровождаются иконкой или текстом.

### Клавиатурная навигация

- Все интерактивные элементы достижимы через Tab в логическом порядке (DOM-порядке).
- Фокус всегда видим — `outline` не убираем через `outline: none` без замены.
- Никаких `tabIndex` > 0 (нарушает естественный порядок); `tabIndex={-1}` только для программного фокуса (honeypot, focus trap).

## 12. SEO/Performance

- Static generation для всех страниц (через `generateStaticParams` + `setRequestLocale`).
- `generateMetadata` per-page: title, description, OG, canonical, languages (hreflang).
- `app/sitemap.ts` — URL × локали.
- `app/robots.ts` — allow all + sitemap link.
- `app/opengraph-image.tsx` — дефолтная заглушка, заменим позже.
- `next/font` self-hosted: без CLS, без запросов на Google.
- Tailwind v4: только используемые утилиты в финальном CSS.

## 13. Что не делаем сейчас

- Тёмная тема, переключатель тем.
- Аналитика (GA/Plausible/Vercel), cookie banner.
- Реальный бэкенд формы — стаб + лог.
- Rate limiting / CAPTCHA для формы (только honeypot).
- CSP заголовок (добавим, когда определимся с внешними скриптами).
- Favicon (`app/icon.svg` или `public/favicon.ico`) — добавим позже.
- E2E тесты, unit-тесты (выходит за рамки этой итерации).
- Storybook / визуальная регрессия.

## 14. Зависимости

```jsonc
{
  "dependencies": {
    "next": "^16",
    "react": "^19",
    "react-dom": "^19",
    "next-intl": "^4",
    "zod": "^3",
    "@t3-oss/env-nextjs": "^0.13",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "postcss": "^8",
    "eslint": "^9",
    "eslint-config-next": "^16",
    "eslint-plugin-jsx-a11y": "^6",
    "@typescript-eslint/eslint-plugin": "^8",
    "@typescript-eslint/parser": "^8",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.6"
  }
}
```

## 15. Acceptance criteria

- `npm run dev` поднимает приложение на `localhost:3000`.
- GET `/` 308-редиректит на `/ru`.
- Каждая из 5 контентных страниц (`/`, `/how-it-works`, `/pricing`, `/waitlist`, `/privacy`) рендерится для `/ru`, `/uk`, `/en`.
- Языковой переключатель в header работает: переключение между локалями сохраняет текущий путь.
- Форма waitlist:
  - Отправка валидных данных → success state (`<SuccessBlock />` внутри той же страницы, без редиректа).
  - Невалидный email → красная ошибка ПОД полем, фокус остаётся, значение сохраняется через `defaultValue={state.prev.email}`.
  - Симуляция server error → общая ошибка над формой, поля сохраняют значения.
  - Spam (заполнен honeypot) → silent success.
- `npm run build` без ошибок и warning'ов.
- `npm run lint` без ошибок.
- `npx tsc --noEmit` без ошибок.
- Lighthouse a11y ≥ 95 на главной.
- Все страницы пререндерены статически (видно в build output).
- Mobile-first вёрстка: на 375px нет горизонтального скролла, тапабельные элементы ≥ 44px.
- Skip link виден при tab-нажатии.
- Никаких `React.*` использований в коде (проверяется grep'ом и/или ESLint правилом).
- Никаких `forwardRef` (React 19 — ref как обычный проп).

## 16. Out of scope (future iterations)

- Реальный бэкенд waitlist (Resend / Supabase / Webhook).
- Тёмная тема.
- Аналитика и cookie banner (GDPR).
- CSP с nonce.
- Rate limiting на server action.
- Локализованные slug'и (`/ru/цены` vs `/en/pricing`) — пока все локали используют английские пути.
- Динамический OG image generation.
- Реальные мета-теги и тексты (заглушки до получения копирайта).
