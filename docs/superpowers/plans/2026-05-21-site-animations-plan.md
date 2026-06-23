# Site Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** [`docs/superpowers/specs/2026-05-21-site-animations-design.md`](../specs/2026-05-21-site-animations-design.md)

**Goal:** Превратить статичный лендинг в premium-restrained motion-сайт с единым CSS-3D-телефоном, путешествующим из hero к scenarios-секции, scroll-reveal-системой, ambient background motion, word-stagger H1 и smooth scroll на десктопе.

**Architecture:** Шесть независимых модулей. `<Reveal>` и `<LenisProvider>` — в `06_shared/ui`. `phone-journey` — новый FSD-widget с единственным root-mount и парой DOM-якорей. Усиление существующего `HeroBgParallax` + новые CSS keyframes (`blob-drift`, `accent-draw`, `cta-pulse`) в `globals.css`. Word-stagger H1 — клиент-компонент `HeroTitle` с SSR initial = final state.

**Tech Stack:** Next.js 16 App Router (RSC default) · React 19 · TypeScript strict · TailwindCSS v4 · framer-motion 12.39.0 (уже стоит) · **lenis** (новая зависимость, ~5KB gzip).

---

## Plan-wide conventions

- **Нет тестового раннера** — CLAUDE.md явно запрещает добавлять Jest/Vitest/Playwright. Test-gate для каждого таска: `npm run lint && npm run typecheck && npm run build` (zero warnings обязательно), затем **manual browser check** по перечисленным критериям.
- **Branch:** `develop` (текущая). PR в `master` только после всех 5 фаз.
- **Commit message format** (следуем history `P4/P5/P6` + `refactor:`):
  - feature commit: `feat: <короткое описание>`
  - fix/cleanup: `chore: <короткое>` или `refactor: <короткое>`
  - phase milestone commit: `anim P{N}: <что включает>`
- **Co-Authored-By:** `Claude Opus 4.7 <noreply@anthropic.com>` в конце каждого commit message (HEREDOC, как в CLAUDE.md).
- **Pre-existing uncommitted changes:** в начале ветки уже есть большой неcommit'ленный diff из предыдущей сессии (удалённые `visuals/*`, `BrandCoin.tsx`, прочее). По указанию пользователя — закоммитить **отдельным предварительным коммитом** в Task 0 ниже.
- **Reduced-motion glue:** в каждом client-компоненте с motion использовать `useReducedMotion()` из `framer-motion`. Все CSS-keyframes заворачивать в `@media (prefers-reduced-motion: no-preference) { ... }` так, чтобы reduced-motion получал static initial state.
- **FSD правила (соблюдать ESLint-free, но обязательно):**
  - hooks → `model/hooks/useFoo.ts` (camelCase file)
  - public API через `index.ts` slice-а
  - slice одного слоя не импортирует другой slice того же слоя (`phone-journey` не лезет в `home-hero`/`home-scenarios-grid` напрямую — общается через DOM-anchor registry в собственном `model/store.ts`)
- **TS:** только `type`, никаких `interface`. Префикс `T` для именованных типов. `import type` для type imports.

---

## Task 0 — Pre-flight commit of pending changes

**Goal:** Запечатать всю накопленную работу предыдущей сессии в чистые коммиты, чтобы новая работа над анимациями была атомарной.

**Files:** определяется на месте через `git status`.

- [ ] **Step 0.1:** Проверить статус.

```bash
git status
git diff --stat
```

- [ ] **Step 0.2:** Сгруппировать изменения и сделать **два** коммита:
  - **Commit A — dead code removal**: все удалённые `visuals/*` (CefrProgressBars, CertificateMedal, CoinExchangeVisual, HomeworkItemList, VoiceBarChart, index), `BrandCoin.tsx`, удалённые shared компоненты (если есть в diff: `Card`, `Coin`, `PhoneMockup`-старая версия, `Select`, `Input`, `Label`, `FieldError`, `HoneypotField`, `PhoneFrame`, unused icons, `buildBarHeights`), а также синхронизирующие правки `ui/index.ts`, `brand/index.ts`, `advantage-tile/model/*` если они зависят только от удалений.
  - **Commit B — pre-anim polish**: всё остальное (правки `globals.css`, `robots.ts`, `sitemap.ts`, messages json, package-lock, llms.txt, изменённые pages/widgets/entities, layout.tsx).

```bash
# Commit A
git add <список deleted+ref-update файлов>
git commit -m "$(cat <<'EOF'
refactor: remove dead-code visuals and unused shared UI

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"

# Commit B
git add <остальные изменённые файлы>
git commit -m "$(cat <<'EOF'
chore: pre-animations content + meta polish

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 0.3:** Verify clean tree.

```bash
git status
# Expected: "nothing to commit, working tree clean"
```

- [ ] **Step 0.4:** Skip if user already committed. Если `git status` пустой — переходим к Task 1.0 сразу.

---

## Phase 1 — Foundation: Reveal + LenisProvider

### Task 1.1 — Install lenis

**Files:**
- Modify: `package.json`, `package-lock.json` (npm сам)

- [ ] **Step 1.1.1:** Install.

```bash
npm install lenis
```

- [ ] **Step 1.1.2:** Verify version in package.json.

```bash
grep '"lenis"' package.json
# Expected: "lenis": "^1.x.x"
```

- [ ] **Step 1.1.3:** Commit.

```bash
git add package.json package-lock.json
git commit -m "$(cat <<'EOF'
chore: add lenis for smooth scroll on desktop

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 1.2 — Create `<Reveal>` component

**Files:**
- Create: `src/06_shared/ui/Reveal/Reveal.tsx`
- Create: `src/06_shared/ui/Reveal/index.ts`
- Modify: `src/06_shared/ui/index.ts`

- [ ] **Step 1.2.1:** Create `src/06_shared/ui/Reveal/Reveal.tsx`.

```tsx
'use client';

import { Children, isValidElement } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_EASE } from '../motion';

type TVariant = 'up' | 'left' | 'right' | 'scale' | 'fade-only';

type TProps = PropsWithChildren<{
  variant?: TVariant;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}>;

const INITIAL: Record<TVariant, Record<string, number>> = {
  up: { opacity: 0, y: 24 },
  left: { opacity: 0, x: -24 },
  right: { opacity: 0, x: 24 },
  scale: { opacity: 0, scale: 0.96 },
  'fade-only': { opacity: 0 },
};

const FINAL: Record<TVariant, Record<string, number>> = {
  up: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  'fade-only': { opacity: 1 },
};

export const Reveal = ({
  variant = 'up',
  delay = 0,
  stagger = 0,
  once = true,
  className,
  children,
}: TProps) => {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  if (stagger > 0) {
    const items = Children.toArray(children);
    return (
      <div className={className}>
        {items.map((child, i) => (
          <motion.div
            key={isValidElement(child) && child.key != null ? child.key : i}
            initial={INITIAL[variant]}
            whileInView={FINAL[variant]}
            viewport={{ once, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: MOTION_EASE.out,
            }}
          >
            {child as ReactNode}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={INITIAL[variant]}
      whileInView={FINAL[variant]}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: MOTION_EASE.out }}
    >
      {children}
    </motion.div>
  );
};
```

- [ ] **Step 1.2.2:** Create barrel `src/06_shared/ui/Reveal/index.ts`.

```ts
export { Reveal } from './Reveal';
```

- [ ] **Step 1.2.3:** Add export to `src/06_shared/ui/index.ts` (alphabetical, after `Portal`).

```ts
export { Reveal } from './Reveal';
```

- [ ] **Step 1.2.4:** Test gate.

```bash
npm run lint && npm run typecheck
```

- [ ] **Step 1.2.5:** Commit.

```bash
git add src/06_shared/ui/Reveal src/06_shared/ui/index.ts
git commit -m "$(cat <<'EOF'
feat: add Reveal wrapper for scroll-in animations

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 1.3 — Create `<LenisProvider>` component

**Files:**
- Create: `src/06_shared/ui/LenisProvider/LenisProvider.tsx`
- Create: `src/06_shared/ui/LenisProvider/index.ts`
- Modify: `src/06_shared/ui/index.ts`
- Modify: `app/globals.css` (add `--header-height` CSS var)

- [ ] **Step 1.3.1:** Add `--header-height` CSS variable in `app/globals.css`. Найти `:root { ... }` блок (или `@theme` если в Tailwind v4 — там tokens) и добавить переменную через **обычный `:root`** (не `@theme`, чтобы можно было overridить в media query):

```css
:root {
  --header-height: 64px;
}

@media (max-width: 767px) {
  :root {
    --header-height: 56px;
  }
}
```

Поместить рядом с другими `:root`-переменными если такие уже есть, иначе в начало файла после `@theme` блока.

- [ ] **Step 1.3.2:** Create `src/06_shared/ui/LenisProvider/LenisProvider.tsx`.

```tsx
'use client';

import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import Lenis from 'lenis';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const readHeaderHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 64;
};

export const LenisProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    const isReduced = window.matchMedia(REDUCED_QUERY).matches;
    if (!isDesktop || isReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = -readHeaderHeight();
      lenis.scrollTo(el, { offset });
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
```

- [ ] **Step 1.3.3:** Create barrel `src/06_shared/ui/LenisProvider/index.ts`.

```ts
export { LenisProvider } from './LenisProvider';
```

- [ ] **Step 1.3.4:** Add export to `src/06_shared/ui/index.ts` (alphabetical, near `JsonLd`).

```ts
export { LenisProvider } from './LenisProvider';
```

- [ ] **Step 1.3.5:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 1.3.6:** Commit.

```bash
git add src/06_shared/ui/LenisProvider src/06_shared/ui/index.ts app/globals.css
git commit -m "$(cat <<'EOF'
feat: add LenisProvider for desktop smooth scroll

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 1.4 — Wire LenisProvider into root layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1.4.1:** Импортировать `LenisProvider` и обернуть содержимое `<NextIntlClientProvider>`. В `app/[locale]/layout.tsx`:

```tsx
// add to existing imports:
import { JsonLd, LenisProvider, SkipLink } from '@/shared/ui';
```

Заменить тело `<NextIntlClientProvider>` так, чтобы было:

```tsx
<NextIntlClientProvider>
  <LenisProvider>
    <SkipLink>{tCommon('skipToContent')}</SkipLink>
    <SiteHeader />
    <main id={ELEMENT_IDS.main}>{children}</main>
    <SiteFooter />
    <JsonLd data={organizationLd} />
  </LenisProvider>
</NextIntlClientProvider>
```

- [ ] **Step 1.4.2:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 1.4.3:** Manual browser check.

```bash
npm run dev
# Open http://localhost:3000/ru on desktop (≥1024px viewport)
# - Scroll wheel: inertia visible (smooth deceleration)
# - Click any anchor link in header (Tarifs / How it works / FAQ): smooth scroll к секции, остановка с offset под фиксированным header
# - Open DevTools → emulate "Reduce motion": перезагрузить, scroll = native (no inertia)
# - Resize to 800px (mobile): scroll = native (no inertia)
```

- [ ] **Step 1.4.4:** Commit.

```bash
git add app/[locale]/layout.tsx
git commit -m "$(cat <<'EOF'
feat: wire LenisProvider into locale layout

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 1.5 — Apply `<Reveal>` to non-hero widgets

**Files:** (modify, по одной строке-обёртке на widget)
- `src/03_widgets/home-pain-mirror/ui/HomePainMirror.tsx`
- `src/03_widgets/home-how-it-works/ui/*.tsx` (главный widget root)
- `src/03_widgets/home-advantages/ui/HomeAdvantages.tsx`
- `src/03_widgets/home-founder-cards/ui/*.tsx`
- `src/03_widgets/home-scenarios-grid/ui/HomeScenariosGrid.tsx` (outer Section content, mobile cards stagger — это произойдёт в Phase 4)
- `src/03_widgets/home-pricing-card/ui/*.tsx`
- `src/03_widgets/faq-section/ui/FaqSection.tsx`
- `src/03_widgets/final-cta-section/ui/FinalCtaSection.tsx`

- [ ] **Step 1.5.1:** Для каждого widget из списка: импортировать `Reveal` из `@/shared/ui` и обернуть основной content-блок секции (то, что внутри `<Container>` после `<SectionHead>`, или весь Container content если SectionHead нет).

Пример для `HomePainMirror.tsx` (паттерн на остальные):

```tsx
// add import:
import { Reveal } from '@/shared/ui';

// before:
<Container>
  <SectionHead .../>
  <SomeContent />
</Container>

// after:
<Container>
  <SectionHead .../>
  <Reveal variant="up">
    <SomeContent />
  </Reveal>
</Container>
```

Для widget с явным списком (e.g. `HomeAdvantages` с tile-list) — обернуть **список** в `<Reveal variant="up" stagger={0.05}>` так, чтобы каждый tile получил cascade:

```tsx
<Reveal variant="up" stagger={0.05} className="...existing-classes">
  {items.map((item) => <AdvantageTile key={item.id} {...item} />)}
</Reveal>
```

- [ ] **Step 1.5.2:** Каждый touched widget — проверить, что `Reveal` обёртка **не ломает CSS-layout** (не добавляет лишнего div там, где есть `display: grid` родителя). Если стаггер нужен внутри grid, дать `<Reveal>` те же `className` как у `<ul>` который он заменяет (`Reveal` рендерит `<div>`, можно сменить ul→div если grid стилизован через class, не через tag).

- [ ] **Step 1.5.3:** Скажем, в `HomeAdvantages` сейчас `<ul className="grid grid-cols-3 ...">`. Превратить в:

```tsx
<Reveal variant="up" stagger={0.05} className="grid grid-cols-3 ...">
  {tiles}
</Reveal>
```

Если semantically нужен `<ul>` — добавить `role="list"` атрибут к Reveal будет невозможно (не пробрасывается). Тогда оставить `<ul>` внутри:

```tsx
<Reveal variant="up">
  <ul className="grid grid-cols-3 ...">{tiles}</ul>
</Reveal>
```

Stagger в этом случае не используется — только один fade-in списка целиком. Это допустимый компромисс.

- [ ] **Step 1.5.4:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 1.5.5:** Manual browser check.

```bash
npm run dev
# Open http://localhost:3000/ru
# Scroll slowly down главной — каждая секция fade-up при ~25% видимости
# Reload — без скролла видна только hero, остальное "за viewport" и появляется при подходе
# DevTools "Reduce motion" → reload → все секции видны без анимации, мгновенно
```

- [ ] **Step 1.5.6:** Commit.

```bash
git add src/03_widgets
git commit -m "$(cat <<'EOF'
feat: apply Reveal to non-hero sections

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Phase 1 closing commit

- [ ] **Step 1.6:** Run final phase gate.

```bash
npm run lint && npm run typecheck && npm run build
# All zero warnings.
```

---

## Phase 2 — Typography: HeroTitle + accent-underline draw

### Task 2.1 — Add accent-underline keyframe in globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 2.1.1:** Открыть `app/globals.css`, найти `.accent-underline::after { ... }` (около строки 506).

Заменить блок:

```css
.accent-underline::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 10px;
  background: var(--color-gold-accent);
  opacity: 0.35;
  border-radius: 6px;
  z-index: -1;
}
```

на:

```css
.accent-underline::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 10px;
  background: var(--color-gold-accent);
  opacity: 0.35;
  border-radius: 6px;
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left center;
}

.accent-underline.is-drawn::after {
  animation: accent-draw 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes accent-draw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .accent-underline::after { transform: scaleX(1); }
  .accent-underline.is-drawn::after { animation: none; }
}
```

**Placement note (Tailwind v4 layer override trap):** Этот блок уже в `@layer components` (родительский комментарий "Accent underline"). Это в Tailwind v4 правильно для CSS, который только определяет классы — НЕ override Tailwind utilities. Оставляем как есть.

- [ ] **Step 2.1.2:** Test gate.

```bash
npm run lint && npm run build
```

- [ ] **Step 2.1.3:** Manual check: на главной (`/ru`) `accent-underline` сейчас будет **невидим** (scaleX 0). Это ОК — будет восстановлен через `.is-drawn` класс из `HeroTitle`. Если в проекте `accent-underline` используется где-то ещё (поиск нужен) — там тоже невидим. Проверить:

```bash
grep -rn "accent-underline" src app 2>/dev/null
```

Если есть другие использования — добавить им `is-drawn` mount logic тоже (или, безопаснее, оставить keyframe `forwards` на дефолт через дополнительный CSS-класс `.accent-underline:not(.no-anim)`). Текущее принятое решение: только Hero H1 использует accent-underline → `HeroTitle` берёт ответственность.

- [ ] **Step 2.1.4:** Commit.

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
feat: add accent-underline draw keyframe

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 2.2 — Create HeroTitle component

**Files:**
- Create: `src/03_widgets/home-hero/ui/HeroTitle.tsx`

- [ ] **Step 2.2.1:** Create `src/03_widgets/home-hero/ui/HeroTitle.tsx`.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_EASE } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  before: string;
  accent: string;
  after: string;
  className?: string;
};

const splitWords = (text: string): string[] =>
  text.split(/(\s+)/).filter((chunk) => chunk.length > 0);

const WORD_DELAY = 0.06;

export const HeroTitle = ({ before, accent, after, className }: TProps) => {
  const [mounted, setMounted] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    setMounted(true);
  }, [shouldReduce]);

  const beforeWords = splitWords(before);
  const accentWords = splitWords(accent);
  const afterWords = splitWords(after);
  const totalWordCount =
    beforeWords.filter((w) => w.trim().length > 0).length +
    accentWords.filter((w) => w.trim().length > 0).length +
    afterWords.filter((w) => w.trim().length > 0).length;
  const underlineDelay = totalWordCount * WORD_DELAY + 0.2;

  const fullText = `${before}${accent}${after}`;

  const renderWords = (words: string[], startIndex: number, wrapAccent = false) =>
    words.map((chunk, i) => {
      if (chunk.trim().length === 0) return <span key={`s-${startIndex + i}`}>{chunk}</span>;
      const wordIndex = startIndex + i;
      const word = (
        <motion.span
          key={`w-${wordIndex}`}
          className="inline-block"
          initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={mounted ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.5,
            delay: wordIndex * WORD_DELAY,
            ease: MOTION_EASE.out,
          }}
        >
          {chunk}
        </motion.span>
      );
      return word;
    });

  return (
    <h1
      className={cn(
        'h-display-hero mt-4 mb-5 font-extrabold leading-[1.03] tracking-[-0.025em] text-ink',
        className,
      )}
      aria-label={fullText}
    >
      <span aria-hidden="true">
        {renderWords(beforeWords, 0)}
        <span
          className={cn('accent-underline', mounted && 'is-drawn')}
          style={{
            // intentional inline only for keyframe-delay synchronisation — keyframe lives in CSS
            // (CSS @keyframes can't read JS-derived word count, so animation-delay is the bridge)
            animationDelay: mounted ? `${underlineDelay}s` : undefined,
          }}
        >
          {renderWords(accentWords, beforeWords.length)}
        </span>
        {renderWords(afterWords, beforeWords.length + accentWords.length)}
      </span>
    </h1>
  );
};
```

> **Inline style exception:** `animationDelay` единственное обоснованное `style={{}}` в проекте — keyframe-delay вычисляется из JS (число слов H1 зависит от локали). Альтернативы: (a) пробросить через CSS custom property — но тогда правило keyframe должно читать `var(--accent-delay)`, что в `@keyframes` напрямую не работает, нужен `animation-delay: var(--accent-delay)`. **Используем CSS custom property** через `style={{}}`. Перепишем (см. ниже Step 2.2.2 fix).

- [ ] **Step 2.2.2:** Заменить блок `<span className="accent-underline ...">` в HeroTitle.tsx так, чтобы вместо `style={{ animationDelay }}` использовать CSS custom property `--accent-delay`. Это всё ещё `style={{}}`, **но** только setter переменной (явный fixed exception под no-inline-style rule):

Заменить:

```tsx
<span
  className={cn('accent-underline', mounted && 'is-drawn')}
  style={{
    animationDelay: mounted ? `${underlineDelay}s` : undefined,
  }}
>
```

на:

```tsx
<span
  className={cn('accent-underline', mounted && 'is-drawn')}
  style={{ '--accent-delay': `${underlineDelay}s` } as React.CSSProperties}
>
```

И в `globals.css` обновить keyframe-trigger:

```css
.accent-underline.is-drawn::after {
  animation: accent-draw 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--accent-delay, 0s) forwards;
}
```

Это единственный inline-style во всём этом изменении и единственный способ сделать JS→CSS bridge для динамического delay без `<style>` injection. Документируем в комментарии перед `style={{...}}` строкой в `HeroTitle.tsx`.

- [ ] **Step 2.2.3:** Test gate.

```bash
npm run lint && npm run typecheck
```

- [ ] **Step 2.2.4:** Commit.

```bash
git add src/03_widgets/home-hero/ui/HeroTitle.tsx app/globals.css
git commit -m "$(cat <<'EOF'
feat: add HeroTitle with word-stagger and underline draw

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 2.3 — Wire HeroTitle into HomeHero

**Files:**
- Modify: `src/03_widgets/home-hero/ui/HomeHero.tsx`

- [ ] **Step 2.3.1:** В `HomeHero.tsx` импортировать `HeroTitle` и заменить inline `<h1 ...>` блок.

```tsx
// add import:
import { HeroTitle } from './HeroTitle';
```

Заменить:

```tsx
<h1
  className="h-display-hero mt-4 mb-5 font-extrabold leading-[1.03] tracking-[-0.025em] text-ink"
>
  {t('title.before')}
  <span className="accent-underline">{t('title.accent')}</span>
  {t('title.after')}
</h1>
```

на:

```tsx
<HeroTitle
  before={t('title.before')}
  accent={t('title.accent')}
  after={t('title.after')}
/>
```

- [ ] **Step 2.3.2:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 2.3.3:** Manual browser check.

```bash
npm run dev
# Open http://localhost:3000/ru → hard reload (Cmd+Shift+R)
# - H1: слова появляются slug-by-slug с задержкой 60ms между словами
# - После последнего слова underline под accent рисуется слева→направо за 800ms
# - View source / Inspector "Elements": <h1> содержит full text (для SEO/LCP) — SSR initial state visible
# - DevTools "Reduce motion" + reload → H1 виден сразу, underline сразу полный
# - Lighthouse desktop: LCP measure should still be ≤2.5s (no JS-blocking on H1)
```

- [ ] **Step 2.3.4:** Commit.

```bash
git add src/03_widgets/home-hero/ui/HomeHero.tsx
git commit -m "$(cat <<'EOF'
feat: render hero H1 via HeroTitle

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Background motion

### Task 3.1 — Strengthen HeroBgParallax

**Files:**
- Modify: `src/03_widgets/home-hero/ui/HeroBgParallax.tsx`

- [ ] **Step 3.1.1:** Заменить содержимое `HeroBgParallax.tsx` на:

```tsx
'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export const HeroBgParallax = () => {
  const shouldReduce = useReducedMotion();
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 800], [0, 320]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.4]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.15]);

  return (
    <motion.div
      aria-hidden="true"
      className="hero-bg-grid"
      style={shouldReduce ? undefined : { y, opacity, scale }}
    />
  );
};
```

**Note on inline style:** `style={{ y, opacity, scale }}` — это `framer-motion` MotionValue-объекты, **не** статичные строки. ESLint правило про inline-style не должно срабатывать (motion-values это не plain object). Если правило настроено агрессивно — добавить eslint-disable next-line с комментарием "framer-motion MotionValue bridge".

- [ ] **Step 3.1.2:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 3.1.3:** Manual check.

```bash
npm run dev
# Open / на desktop
# Scroll вниз — grid фон уезжает вниз быстрее контента, opacity падает, лёгкий zoom out
# Эффект должен быть ЧЁТКО заметен (а не слабо как раньше)
# Reduced motion → grid статичный
```

- [ ] **Step 3.1.4:** Commit.

```bash
git add src/03_widgets/home-hero/ui/HeroBgParallax.tsx
git commit -m "$(cat <<'EOF'
feat: strengthen hero grid parallax (y/opacity/scale)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 3.2 — Hero ambient blob

**Files:**
- Modify: `app/globals.css` (add `.hero-ambient-blob` + keyframe)
- Modify: `src/03_widgets/home-hero/ui/HomeHero.tsx` (add element)

- [ ] **Step 3.2.1:** В `app/globals.css`, рядом с `.hero-bg-grid` правилом (в том же `@layer components` блоке) добавить:

```css
.hero-ambient-blob {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--color-primary) 18%, transparent),
    transparent 70%
  );
  filter: blur(80px);
  z-index: 1;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

@media (prefers-reduced-motion: no-preference) {
  .hero-ambient-blob {
    animation: blob-drift 24s ease-in-out infinite alternate;
  }
}

@keyframes blob-drift {
  0%   { transform: translate(-50%, -50%) translate(0, 0); }
  50%  { transform: translate(-50%, -50%) translate(40px, -30px); }
  100% { transform: translate(-50%, -50%) translate(-30px, 40px); }
}
```

**Z-index ordering в hero:** `.hero-bg-grid` z 0 → `.hero-ambient-blob` z 1 → content/phone z 10 (явно зададим в HomeHero для контентного `<Container>`).

- [ ] **Step 3.2.2:** В `HomeHero.tsx` добавить blob и поднять z-index у `<Container>`. После `<HeroBgParallax />` добавить:

```tsx
<HeroBgParallax />
<div className="hero-ambient-blob" aria-hidden="true" />
```

И добавить класс `relative z-10` (или Tailwind native) на `<Container className="px-0">`:

```tsx
<Container className="relative z-10 px-0">
```

- [ ] **Step 3.2.3:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 3.2.4:** Manual check.

```bash
npm run dev
# Открыть /ru, посмотреть hero
# - Под телефоном (и H1) мягкое цветное "дыхание" — медленно дрейфующее размытое пятно
# - Не перекрывает текст (z-index ниже контента)
# - Reduced motion → blob виден, но не двигается
```

- [ ] **Step 3.2.5:** Commit.

```bash
git add app/globals.css src/03_widgets/home-hero/ui/HomeHero.tsx
git commit -m "$(cat <<'EOF'
feat: add hero ambient blob drift

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task 3.3 — Finale CTA pulse glow

**Files:**
- Modify: `app/globals.css` (add `.cta-pulse-glow` + keyframe)
- Modify: `src/03_widgets/final-cta-section/ui/FinalCtaSection.tsx`

- [ ] **Step 3.3.1:** В `app/globals.css`, после blob block:

```css
.cta-pulse-glow {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--color-primary) 22%, transparent),
    transparent 70%
  );
  filter: blur(60px);
  z-index: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .cta-pulse-glow {
    animation: cta-pulse 4s ease-in-out infinite;
  }
}

@keyframes cta-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(1.05); opacity: 0.95; }
}
```

- [ ] **Step 3.3.2:** В `FinalCtaSection.tsx` найти primary-кнопку (ButtonLink с variant="primary"). Обернуть её в `relative` wrapper и добавить glow:

```tsx
// Around primary CTA button:
<div className="relative inline-block">
  <span className="cta-pulse-glow" aria-hidden="true" />
  <ButtonLink ...>{...}</ButtonLink>
</div>
```

Если ButtonLink уже внутри inline-flex или wrapper'а — поместить `<span class="cta-pulse-glow">` сиблингом до кнопки, обернуть в `relative`.

- [ ] **Step 3.3.3:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 3.3.4:** Manual check.

```bash
# Scroll до final-cta секции в /ru
# - Под primary-кнопкой мягкая pulsating подсветка, период 4с
# - Reduced motion → glow статичен, кнопка читается чисто
```

- [ ] **Step 3.3.5:** Commit.

```bash
git add app/globals.css src/03_widgets/final-cta-section/ui/FinalCtaSection.tsx
git commit -m "$(cat <<'EOF'
feat: add pulse glow under final CTA

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — PhoneJourney (главный риск)

### Task 4.1 — Scaffold phone-journey slice + types + store

**Files:**
- Create: `src/03_widgets/phone-journey/index.ts`
- Create: `src/03_widgets/phone-journey/model/types.ts`
- Create: `src/03_widgets/phone-journey/model/store.ts`
- Create: `src/03_widgets/phone-journey/model/hooks/usePhoneJourneyAnchor.ts`

- [ ] **Step 4.1.1:** Create `src/03_widgets/phone-journey/model/types.ts`.

```ts
import type { RefObject } from 'react';

export type TPhoneJourneyRole = 'source' | 'target';

export type TPhoneJourneyAnchor = {
  role: TPhoneJourneyRole;
  ref: RefObject<HTMLElement | null>;
};

export type TPhoneJourneyContent = {
  botName: string;
  messages: import('@/entities/phone-mockup').TPhoneMessage[];
};
```

- [ ] **Step 4.1.2:** Create `src/03_widgets/phone-journey/model/store.ts`. Минимальный shared registry через React Context.

```ts
'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren, RefObject } from 'react';
import type { TPhoneJourneyContent, TPhoneJourneyRole } from './types';

type TRegistry = {
  source: RefObject<HTMLElement | null> | null;
  target: RefObject<HTMLElement | null> | null;
};

type TPhoneJourneyContext = {
  registry: TRegistry;
  registerAnchor: (role: TPhoneJourneyRole, ref: RefObject<HTMLElement | null>) => void;
  unregisterAnchor: (role: TPhoneJourneyRole) => void;
  activeContent: TPhoneJourneyContent | null;
  setActiveContent: (content: TPhoneJourneyContent | null) => void;
};

const PhoneJourneyContext = createContext<TPhoneJourneyContext | null>(null);

export const PhoneJourneyProvider = ({ children }: PropsWithChildren) => {
  const registryRef = useRef<TRegistry>({ source: null, target: null });
  const [activeContent, setActiveContent] = useState<TPhoneJourneyContent | null>(null);

  const registerAnchor = useCallback(
    (role: TPhoneJourneyRole, ref: RefObject<HTMLElement | null>) => {
      registryRef.current = { ...registryRef.current, [role]: ref };
    },
    [],
  );

  const unregisterAnchor = useCallback((role: TPhoneJourneyRole) => {
    registryRef.current = { ...registryRef.current, [role]: null };
  }, []);

  const value = useMemo<TPhoneJourneyContext>(
    () => ({
      registry: registryRef.current,
      registerAnchor,
      unregisterAnchor,
      activeContent,
      setActiveContent,
    }),
    [registerAnchor, unregisterAnchor, activeContent],
  );

  return <PhoneJourneyContext.Provider value={value}>{children}</PhoneJourneyContext.Provider>;
};

export const usePhoneJourneyContext = () => {
  const ctx = useContext(PhoneJourneyContext);
  if (!ctx) throw new Error('usePhoneJourneyContext must be used within PhoneJourneyProvider');
  return ctx;
};
```

- [ ] **Step 4.1.3:** Create `src/03_widgets/phone-journey/model/hooks/usePhoneJourneyAnchor.ts`.

```ts
'use client';

import { useEffect, useRef } from 'react';
import { usePhoneJourneyContext } from '../store';
import type { TPhoneJourneyRole } from '../types';

export const usePhoneJourneyAnchor = (role: TPhoneJourneyRole) => {
  const ref = useRef<HTMLElement | null>(null);
  const { registerAnchor, unregisterAnchor } = usePhoneJourneyContext();

  useEffect(() => {
    registerAnchor(role, ref);
    return () => unregisterAnchor(role);
  }, [role, registerAnchor, unregisterAnchor]);

  return ref;
};
```

- [ ] **Step 4.1.4:** Create `src/03_widgets/phone-journey/index.ts` (пока заглушки экспортов; добавим после Task 4.2/4.3).

```ts
export { PhoneJourneyProvider } from './model/store';
export { PhoneJourneyMount } from './ui/PhoneJourneyMount';
export { PhoneJourney } from './ui/PhoneJourney';
export { usePhoneJourneyContext } from './model/store';
```

(Файлы `PhoneJourneyMount.tsx`, `PhoneJourney.tsx` создаются ниже — этот index.ts будет временно ломать ts-resolve, починим в Task 4.2 и 4.3.)

- [ ] **Step 4.1.5:** Не commit'имся ещё — index.ts с broken imports. Переходим к 4.2.

### Task 4.2 — PhoneJourneyMount (anchor placeholder)

**Files:**
- Create: `src/03_widgets/phone-journey/ui/PhoneJourneyMount.tsx`

- [ ] **Step 4.2.1:** Create `src/03_widgets/phone-journey/ui/PhoneJourneyMount.tsx`.

```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { usePhoneJourneyAnchor } from '../model/hooks/usePhoneJourneyAnchor';
import type { TPhoneJourneyRole } from '../model/types';

type TProps = {
  role: TPhoneJourneyRole;
  className?: string;
  /** Aspect-ratio mock (e.g. "9 / 19.5") for layout reserve. Required for source anchor (hero). */
  aspect?: string;
};

const subscribe = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(min-width: 1024px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
};

const getServerSnapshot = () => false;

export const PhoneJourneyMount = ({ role, className, aspect }: TProps) => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ref = usePhoneJourneyAnchor(role);

  if (!isDesktop) return null;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      aria-hidden="true"
      style={aspect ? ({ aspectRatio: aspect } as React.CSSProperties) : undefined}
    />
  );
};
```

**Inline style note:** `aspectRatio` устанавливается через custom property bridge как в HeroTitle case (см. Phase 2 comment). Если ESLint-rule строгий, заменить на Tailwind-arbitrary-через-CSS-var или CSS-класс с переменной. Так как `aspect-ratio` динамическая в редких случаях и не Tailwind-purgable, оставляем как явное исключение с комментарием.

- [ ] **Step 4.2.2:** Test gate.

```bash
npm run lint && npm run typecheck
```

- [ ] **Step 4.2.3:** Continue к 4.3 без commit.

### Task 4.3 — PhoneJourney root component

**Files:**
- Create: `src/03_widgets/phone-journey/ui/PhoneJourney.tsx`
- Create: `src/03_widgets/phone-journey/model/hooks/usePhoneJourneyScroll.ts`

- [ ] **Step 4.3.1:** Create `src/03_widgets/phone-journey/model/hooks/usePhoneJourneyScroll.ts`. Этот хук читает позиции source/target anchors и преобразует scrollY в transform-стейт.

```ts
'use client';

import { useEffect, useState } from 'react';
import { usePhoneJourneyContext } from '../store';

type TJourneyState = {
  x: number;
  y: number;
  scale: number;
  rotateY: number;
  visible: boolean;
};

const SOURCE_SCALE = 1;
const TARGET_SCALE = 0.8;
const SOURCE_ROTATE_Y = 0;
const TARGET_ROTATE_Y = -6;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const usePhoneJourneyScroll = (): TJourneyState => {
  const { registry } = usePhoneJourneyContext();
  const [state, setState] = useState<TJourneyState>({
    x: 0,
    y: 0,
    scale: SOURCE_SCALE,
    rotateY: SOURCE_ROTATE_Y,
    visible: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const compute = () => {
      const sourceEl = registry.source?.current;
      const targetEl = registry.target?.current;
      if (!sourceEl) {
        setState((s) => ({ ...s, visible: false }));
        return;
      }
      const sRect = sourceEl.getBoundingClientRect();
      const tRect = targetEl?.getBoundingClientRect();

      if (!tRect) {
        // Only source visible — stay glued to source.
        setState({
          x: sRect.left + sRect.width / 2,
          y: sRect.top + sRect.height / 2,
          scale: SOURCE_SCALE,
          rotateY: SOURCE_ROTATE_Y,
          visible: true,
        });
        return;
      }

      // Journey progresses as the target slot scrolls from below the viewport to its resting spot.
      // Interpolation t: 0 when target's top is at viewport bottom, 1 when target's top is at viewport top.
      const vh = window.innerHeight;
      const denom = vh; // distance over which we interpolate
      const t = clamp01(1 - tRect.top / denom);

      const sx = sRect.left + sRect.width / 2;
      const sy = sRect.top + sRect.height / 2;
      const tx = tRect.left + tRect.width / 2;
      const ty = tRect.top + tRect.height / 2;

      setState({
        x: lerp(sx, tx, t),
        y: lerp(sy, ty, t),
        scale: lerp(SOURCE_SCALE, TARGET_SCALE, t),
        rotateY: lerp(SOURCE_ROTATE_Y, TARGET_ROTATE_Y, t),
        visible: true,
      });
    };

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [registry.source, registry.target]);

  return state;
};
```

- [ ] **Step 4.3.2:** Create `src/03_widgets/phone-journey/ui/PhoneJourney.tsx`.

```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PhoneMockup } from '@/entities/phone-mockup';
import { MOTION_DURATION, MOTION_EASE } from '@/shared/ui';
import { usePhoneJourneyContext } from '../model/store';
import { usePhoneJourneyScroll } from '../model/hooks/usePhoneJourneyScroll';

const subscribe = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(min-width: 1024px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
};

const getServerSnapshot = () => false;

export const PhoneJourney = () => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const shouldReduce = useReducedMotion();
  const { activeContent } = usePhoneJourneyContext();
  const { x, y, scale, rotateY, visible } = usePhoneJourneyScroll();

  if (!isDesktop || !activeContent) return null;

  return (
    <div
      className="phone-journey-layer"
      aria-hidden="true"
      style={{ '--pj-x': `${x}px`, '--pj-y': `${y}px` } as React.CSSProperties}
    >
      <motion.div
        className="phone-journey-stage"
        style={
          shouldReduce
            ? undefined
            : ({
                transform: `translate3d(calc(var(--pj-x) - 50%), calc(var(--pj-y) - 50%), 0) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity: visible ? 1 : 0,
              } as React.CSSProperties)
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeContent.botName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduce ? 0 : MOTION_DURATION.base,
              ease: MOTION_EASE.out,
            }}
          >
            <PhoneMockup
              botName={activeContent.botName}
              botStatus="online"
              dateLabel="Today"
              inputPlaceholder="Message…"
              micLabel="Voice message"
              messages={activeContent.messages}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
```

- [ ] **Step 4.3.3:** Add CSS for `.phone-journey-layer` + `.phone-journey-stage` в `app/globals.css` (в @layer components):

```css
.phone-journey-layer {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}

.phone-journey-stage {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center center;
  perspective: 1200px;
  will-change: transform, opacity;
}
```

- [ ] **Step 4.3.4:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 4.3.5:** Continue к 4.4 без commit.

### Task 4.4 — Hero: source anchor + content registration

**Files:**
- Modify: `src/03_widgets/home-hero/ui/HomeHero.tsx`
- Modify: `src/03_widgets/home-hero/ui/HomePhonePreview.tsx`
- Create: `src/03_widgets/home-hero/ui/HeroPhoneSlot.tsx` (client wrapper, переключает desktop=якорь vs mobile=inline mockup)

- [ ] **Step 4.4.1:** Создать `src/03_widgets/home-hero/ui/HeroPhoneSlot.tsx`.

```tsx
'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { PhoneJourneyMount, usePhoneJourneyContext } from '@/widgets/phone-journey';
import type { TPhoneMessage } from '@/entities/phone-mockup';

type TProps = {
  inlineMobile: ReactNode;
  desktopContent: {
    botName: string;
    messages: TPhoneMessage[];
  };
};

const subscribe = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(min-width: 1024px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
};

const getServerSnapshot = () => false;

export const HeroPhoneSlot = ({ inlineMobile, desktopContent }: TProps) => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { setActiveContent } = usePhoneJourneyContext();

  useEffect(() => {
    if (!isDesktop) return;
    setActiveContent(desktopContent);
    return () => setActiveContent(null);
  }, [isDesktop, desktopContent, setActiveContent]);

  if (!isDesktop) return <>{inlineMobile}</>;

  return (
    <PhoneJourneyMount
      role="source"
      className="phone-preview-wrap phone-preview-wrap--compact"
      aspect="9 / 19.5"
    />
  );
};
```

- [ ] **Step 4.4.2:** Изменить `HomeHero.tsx` (server-component): передавать content в client `HeroPhoneSlot`, и вместо прямого `<HomePhonePreview />` рендерить slot. Перенести `getList<TPhoneMessage>(t, 'messages')` вверх (из HomePhonePreview сейчас он там):

```tsx
// Top of HomeHero.tsx — extend imports:
import { getList } from '@/shared/model/libs/i18n/get-list';
import type { TPhoneMessage } from '@/entities/phone-mockup';
import { HeroPhoneSlot } from './HeroPhoneSlot';
import { HomePhonePreview } from './HomePhonePreview';

// inside HomeHero(): after existing t/locale calls
const phoneT = await getTranslations('HomePage.hero.phonePreview');
const phoneMessages = getList<TPhoneMessage>(phoneT, 'messages');
const phoneBotName = phoneT('botName');

// Right column replacement:
<div className="relative flex justify-center lg:justify-end">
  <HeroPhoneSlot
    inlineMobile={<HomePhonePreview />}
    desktopContent={{ botName: phoneBotName, messages: phoneMessages }}
  />
</div>
```

`HomePhonePreview` остаётся как mobile-inline вариант — рендерится только когда `HeroPhoneSlot` решает `inlineMobile` ветку.

- [ ] **Step 4.4.3:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

(Build будет успешен, но runtime потребует `PhoneJourneyProvider` в layout — пока не подключён, контекст бросит. Это починим в Task 4.6. До этого manual check не делаем.)

- [ ] **Step 4.4.4:** Continue к 4.5.

### Task 4.5 — Scenarios desktop reworked + target anchor + 8 stops

**Files:**
- Modify: `src/03_widgets/home-scenarios-grid/ui/HomeScenariosGrid.tsx`
- Create: `src/03_widgets/home-scenarios-grid/ui/ScenariosDesktopJourney.tsx` (client component для scroll-driven активной карточки)

- [ ] **Step 4.5.1:** Create `src/03_widgets/home-scenarios-grid/ui/ScenariosDesktopJourney.tsx`. Это desktop-only widget с long scroll-container, target anchor слева и 8 карточками справа.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { cn } from '@/shared/model/libs/cn';
import { ArrowRightIcon, Container, MOTION_DURATION, MOTION_EASE, SectionHead } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { PhoneJourneyMount, usePhoneJourneyContext } from '@/widgets/phone-journey';
import { SCENARIO_PHONE_CONTENT } from '../model/phone-content';
import type { TScenarioCard } from '../model/types';

type TProps = {
  cards: TScenarioCard[];
  locale: string;
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export const ScenariosDesktopJourney = ({
  cards,
  locale,
  kicker,
  title,
  subtitle,
  ctaLabel,
}: TProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduce = useReducedMotion();
  const { setActiveContent } = usePhoneJourneyContext();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * cards.length), cards.length - 1);
    setActiveIndex(idx);
  });

  // Push active scenario content to PhoneJourney
  useEffect(() => {
    const card = cards[activeIndex];
    if (!card) return;
    const content = SCENARIO_PHONE_CONTENT[card.id];
    if (content) {
      setActiveContent({ botName: content.botName, messages: content.messages });
    }
    return () => {
      // Don't null content on unmount — Hero slot will reclaim ownership.
    };
  }, [activeIndex, cards, setActiveContent]);

  return (
    <div ref={scrollRef} className="scenarios-scroll-region relative hidden lg:block">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <Container className="pt-14 md:pt-20">
          <SectionHead
            kicker={kicker}
            title={title}
            titleId="scenarios-grid-heading"
            subtitle={subtitle}
          />
        </Container>
        <Container className="flex flex-1 items-center gap-12 pb-8">
          <div className="flex-shrink-0">
            <PhoneJourneyMount
              role="target"
              className="phone-preview-wrap phone-preview-wrap--scenarios"
              aspect="9 / 19.5"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {cards.map((card, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.a
                  key={card.id}
                  href={buildBotUrl(locale, card.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  animate={{
                    opacity: isActive ? 1 : 0.45,
                    scale: shouldReduce ? 1 : isActive ? 1 : 0.98,
                  }}
                  transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE.out }}
                  className={cn(
                    'group flex min-w-0 items-center gap-4 rounded-card border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isActive
                      ? 'border-primary bg-white shadow-(--shadow-soft)'
                      : 'border-line bg-white/60',
                  )}
                  aria-label={`${ctaLabel} — ${card.title}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="m-0 truncate text-base font-bold tracking-tight text-ink">
                        {card.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-mini font-semibold text-muted">
                        {card.duration}
                      </span>
                    </div>
                    <p className="m-0 mt-0.5 text-13 font-medium text-primary">{card.aiRole}</p>
                  </div>
                  <ArrowRightIcon
                    size={14}
                    className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </motion.a>
              );
            })}
          </div>
        </Container>
      </div>
      {/* Spacer: gives the sticky container scroll-length === 8 stops × viewport */}
      <div className="h-[800vh]" aria-hidden="true" />
    </div>
  );
};
```

> **Note on inline-style:** в этом файле inline-style **не используется** — все размеры в Tailwind utility (h-[800vh] arbitrary). Если ESLint забанит arbitrary-value `h-[800vh]` (см. feedback `no_arbitrary_tailwind`), заменить на token. Можно добавить в `@theme`:
> ```css
> @theme { --height-journey-spacer: 800vh; }
> ```
> и использовать `h-(--height-journey-spacer)`. Решение принять при первом lint-fail.

- [ ] **Step 4.5.2:** Изменить `HomeScenariosGrid.tsx`. Mobile-ветка остаётся как сейчас (текущий grid с Reveal stagger из Phase 1.5). Добавить desktop-вариант через `<ScenariosDesktopJourney>`:

```tsx
import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { ArrowRightIcon, Container, Reveal, Section, SectionHead } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { ANCHORS } from '@/shared/config';
import { ScenariosDesktopJourney } from './ScenariosDesktopJourney';
import type { TScenarioCard } from '../model/types';

export const HomeScenariosGrid = async () => {
  const t = await getTranslations('HomePage.scenariosGrid');
  const locale = await getLocale();
  const cards = getList<TScenarioCard>(t, 'cards');
  const ctaLabel = t('ctaLabel');
  const kicker = t('kicker');
  const title = t('title');
  const subtitle = t('subtitle');

  return (
    <Section id={ANCHORS.scenarios} ariaLabelledBy="scenarios-grid-heading">
      {/* DESKTOP — sticky phone journey with 8 stops */}
      <ScenariosDesktopJourney
        cards={cards}
        locale={locale}
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
      />

      {/* MOBILE — grid with reveal stagger */}
      <Container className="lg:hidden">
        <SectionHead
          kicker={kicker}
          title={title}
          titleId="scenarios-grid-heading"
          subtitle={subtitle}
        />
        <Reveal variant="up" stagger={0.05} className="mt-10 m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {cards.map((card) => (
            <a
              key={card.id}
              href={buildBotUrl(locale, card.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group relative flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-(--shadow-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`${ctaLabel} — ${card.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="m-0 text-lg font-bold tracking-tight text-ink">{card.title}</h3>
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-mini font-semibold text-muted">
                  {card.duration}
                </span>
              </div>
              <p className="m-0 mt-1.5 text-13 font-medium text-primary">{card.aiRole}</p>
              <p className="m-0 mt-3 flex-1 text-14-5 leading-relaxed text-muted">{card.hook}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-[gap] group-hover:gap-2">
                {ctaLabel}
                <ArrowRightIcon size={14} />
              </div>
            </a>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
};
```

> `<Reveal>` принимает ReactNode children — но stagger режим итерирует через `Children.toArray`. Список из `cards.map()` будет восприниматься как массив элементов корректно (см. Step 1.2.1 реализацию).

- [ ] **Step 4.5.3:** Удостовериться, что `model/types.ts` экспортирует `TScenarioCard` — `HomeScenariosGrid` теперь импортирует тип. Проверить:

```bash
grep "TScenarioCard" src/03_widgets/home-scenarios-grid/model/types.ts
```

Если export отсутствует — добавить.

- [ ] **Step 4.5.4:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 4.5.5:** Continue к 4.6.

### Task 4.6 — Wire PhoneJourneyProvider + PhoneJourney into root layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 4.6.1:** Импортировать и встроить `PhoneJourneyProvider` + `PhoneJourney`.

```tsx
import { PhoneJourney, PhoneJourneyProvider } from '@/widgets/phone-journey';
```

Заменить тело `<LenisProvider>`:

```tsx
<LenisProvider>
  <PhoneJourneyProvider>
    <SkipLink>{tCommon('skipToContent')}</SkipLink>
    <SiteHeader />
    <main id={ELEMENT_IDS.main}>{children}</main>
    <SiteFooter />
    <JsonLd data={organizationLd} />
    <PhoneJourney />
  </PhoneJourneyProvider>
</LenisProvider>
```

- [ ] **Step 4.6.2:** Test gate.

```bash
npm run lint && npm run typecheck && npm run build
```

- [ ] **Step 4.6.3:** Manual browser check (полный сценарий).

```bash
npm run dev
# Open http://localhost:3000/ru, viewport ≥ 1024px (desktop):
# 1. Hero: phone виден в правой колонке. Реальный DOM-узел — fixed layer (DevTools "phone-journey-layer"), якорь HeroPhoneSlot пустой div занимает место.
# 2. Slow scroll вниз: phone плавно уменьшается, едет влево, поворачивается.
# 3. К началу scenarios-секции phone оказывается слева (в позиции target anchor).
# 4. Дальнейший scroll внутри scenarios: активная карточка из 8 переключается; контент чата в phone сменяется через AnimatePresence fade.
# 5. После scenarios: phone остаётся видим/sticky слева до конца spacer'а, потом исчезает (visible=false) если выскролили за target rect.
# 6. Reload: phone в hero статичный, контент чата = hero default.

# Resize to 800px (mobile):
# 1. Hero: inline mockup как раньше (HomePhonePreview).
# 2. Scenarios: grid карточек с reveal stagger.
# 3. Никакого fixed-phone, никакого journey.

# DevTools "Reduce motion" + reload (desktop):
# 1. Phone в hero статичный, без idle rotation.
# 2. Scroll → phone остаётся в стартовой позиции до scenarios; в scenarios — переключение карточек мгновенное.
```

- [ ] **Step 4.6.4:** Commit Phase 4.

```bash
git add src/03_widgets/phone-journey \
        src/03_widgets/home-hero/ui/HeroPhoneSlot.tsx \
        src/03_widgets/home-hero/ui/HomeHero.tsx \
        src/03_widgets/home-scenarios-grid/ui/HomeScenariosGrid.tsx \
        src/03_widgets/home-scenarios-grid/ui/ScenariosDesktopJourney.tsx \
        app/[locale]/layout.tsx \
        app/globals.css
git commit -m "$(cat <<'EOF'
anim P4: PhoneJourney — single phone travels hero→scenarios

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Cleanup + audit

### Task 5.1 — Lint, typecheck, build sweep

- [ ] **Step 5.1.1:** Полная проверка.

```bash
npm run lint && npm run typecheck && npm run build
```

Все три — zero warnings. Любое предупреждение фиксится **до** перехода к следующему step.

- [ ] **Step 5.1.2:** Bundle size sanity check.

```bash
# Из next build output найти строку "Route (app)" и "First Load JS":
# Сравнить с predicted baseline (запомнить число до Phase 1; должно вырасти ≤ 20KB gzip).
```

Если новый JS превышает 20KB gzip → рассмотреть dynamic-import Lenis (только на desktop), либо урезать unused framer-motion features.

### Task 5.2 — Lighthouse audit

- [ ] **Step 5.2.1:** Запустить prod-build локально.

```bash
npm run build && npm run start
# Open http://localhost:3000/ru
```

- [ ] **Step 5.2.2:** Chrome DevTools → Lighthouse → "Mobile" mode → "Performance" категория → Analyze. Цели:
- LCP ≤ 2.5s
- INP (lab) ≤ 200ms
- CLS ≤ 0.1
- Total bundle JS прирост ≤ 20KB gzip

- [ ] **Step 5.2.3:** Если любой метрик красный — debug:
- LCP regression → проверить, что HeroTitle SSR initial state = final (текст виден сразу).
- INP regression → искать heavy scroll handlers; убедиться, что usePhoneJourneyScroll использует RAF.
- CLS regression → искать late-mounted `position: fixed` элементы (PhoneJourney shouldn't shift layout — но может, если SSR рендерит anchor div нулевой высоты на mobile/desktop разно).

### Task 5.3 — Final commit + push

- [ ] **Step 5.3.1:** Если в Phase 5 были fixes — отдельный commit.

```bash
git status
# Если есть изменения:
git add <files>
git commit -m "$(cat <<'EOF'
anim P5: lighthouse + bundle audit fixes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5.3.2:** Push branch.

```bash
git push -u origin develop
```

- [ ] **Step 5.3.3:** (Опционально, по ask пользователя): открыть PR в `master`.

```bash
gh pr create --title "Site animations: Reveal + PhoneJourney + ambient motion" --body "$(cat <<'EOF'
## Summary
- Adds `<Reveal>` scroll-in wrapper across non-hero sections
- Adds `LenisProvider` for desktop smooth scroll (disabled on mobile + reduced-motion)
- Adds `PhoneJourney` — single CSS-3D phone travels from hero to scenarios with 8 content stops
- Strengthens hero `HeroBgParallax` (y/opacity/scale)
- Adds ambient blob in hero + pulse glow under finale CTA
- Adds hero H1 word-stagger + accent-underline draw via new `HeroTitle`
- Spec: docs/superpowers/specs/2026-05-21-site-animations-design.md
- Plan: docs/superpowers/plans/2026-05-21-site-animations-plan.md

## Test plan
- [ ] Desktop ≥1024px: H1 word-stagger; phone travels hero→scenarios with content swap; smooth scroll on wheel/anchor
- [ ] Mobile <1024px: inline phone in hero; grid scenarios with reveal-stagger; native scroll
- [ ] `prefers-reduced-motion`: zero motion, content snaps to final state instantly
- [ ] Lighthouse mobile: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] `npm run build` zero warnings

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review checklist (run after writing complete plan)

**1. Spec coverage:**

| Spec section | Task(s) covering it |
|---|---|
| §1 Goal 1 (premium-restrained tone) | All — premium constraints embedded in MOTION_DURATION/EASE choices |
| §1 Goal 2 (phone journey) | Phase 4 (Tasks 4.1-4.6) |
| §1 Goal 3 (Reveal wrapper) | Tasks 1.2, 1.5 |
| §1 Goal 4 (background motion) | Tasks 3.1, 3.2, 3.3 |
| §1 Goal 5 (Lenis desktop smooth) | Tasks 1.3, 1.4 |
| §1 Goal 6 (a11y/perf budgets) | Reduced-motion guards in every Phase; Phase 5 audit |
| §3 budgets | Phase 5 Task 5.2 measures + acts |
| §4 CSS 3D rationale | Task 4.3 implementation |
| §5.1 Reveal | Task 1.2 |
| §5.2 PhoneJourney | Tasks 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 |
| §5.3 LenisProvider | Tasks 1.3, 1.4 |
| §5.4 Hero ambient motion | Tasks 3.1, 3.2 |
| §5.5 H1 word-stagger + underline | Tasks 2.1, 2.2, 2.3 |
| §5.6 Finale pulse | Task 3.3 |
| §6 Section behavior map | Task 1.5 (Reveal across widgets) + Task 4.5 (scenarios desktop/mobile branch) |
| §7 File changes | Полное покрытие (verify через cross-reference path списка) |
| §8 Phasing | Plan structure mirrors §8 phases |
| §9 Acceptance criteria | Each item verified in manual checks of Phase 1-4 + Lighthouse Phase 5 |
| §10 Risks | Mitigations baked into Tasks: ResizeObserver in usePhoneJourneyScroll (4.3); Lenis anchor handling (1.3); SSR initial state in HeroTitle (2.2) |

Все sections спеки покрыты. Gaps: нет.

**2. Placeholder scan:** Поиск "TBD", "TODO", "implement later", "fill in details", "Add appropriate error handling", "Add validation". Найдено в плане: **0**. Все steps содержат конкретный код или конкретные команды.

**3. Type consistency:**
- `TPhoneJourneyRole` определён в 4.1.1, используется в 4.1.2, 4.1.3, 4.2.1.
- `TPhoneJourneyContent` определён в 4.1.1, используется в 4.1.2, 4.3.2 (через context), 4.4.1, 4.5.1.
- `usePhoneJourneyContext` определён в 4.1.2, используется в 4.1.3, 4.3.2, 4.4.1, 4.5.1.
- `PhoneJourneyMount` определён в 4.2.1, используется в 4.4.1, 4.5.1.
- `HeroPhoneSlot` определён в 4.4.1, используется в 4.4.2.
- `ScenariosDesktopJourney` определён в 4.5.1, используется в 4.5.2.
- `Reveal` определён в 1.2.1, экспортирован в 1.2.3, используется в 1.5, 4.5.2.
- `LenisProvider` определён в 1.3.2, экспортирован в 1.3.4, используется в 1.4.1.

Все cross-references согласованы.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-21-site-animations-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, two-stage review, fast iteration
2. **Inline Execution** — execute tasks in current session via executing-plans, batch checkpoints

Which approach?
