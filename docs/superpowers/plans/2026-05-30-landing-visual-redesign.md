# Landing Visual Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать утверждённый визуальный + анимационный редизайн лендинга SpeakMove (главная, /pricing, /how-it-works, legal) по спеке `docs/superpowers/specs/2026-05-29-landing-visual-redesign-design.md`.

**Architecture:** FSD (как в репо). Глобальный ритм — полосы с чередованием фона + акцентные карты + full-bleed цветные секции с волной-divider. Анимации — `framer-motion` (уже стоит) + CSS-keyframes + `lenis`, с `prefers-reduced-motion` fallback везде. Новые общие примитивы (Icon-волна/voice/globe, motion-пресеты, `<Reveal>`, hooks параллакса/наклона) — в `06_shared`, дальше переиспользуются виджетами.

**Tech Stack:** Next.js 16 (RSC) · React 19 · TypeScript strict · Tailwind v4 (CSS-first, `@theme`) · next-intl v4 · framer-motion ^12 · lenis.

**Жёсткие правила проекта (см. CLAUDE.md):** нет inline `<svg>` (иконки в `06_shared/ui/Icon/`); нет arbitrary Tailwind (`text-[..]`/`bg-[#..]`/`rounded-[..]`) → токены в `@theme`; нет inline `style={{}}` (динамика → CSS-переменные из `@theme`); `type` (не `interface`), типы с префиксом `T`; не импортировать `default` из `react`; нет `forwardRef` (ref — обычный проп); хуки в `model/hooks/useFoo.ts`; публичный API слайса через `index.ts`; CSS-оверрайды утилит — вне `@layer components`.

---

## Verification protocol (вместо тестов — в репо нет раннера)

После **каждой** задачи прогонять и убеждаться, что проходит без ошибок/ворнингов:

```bash
nvm use && npm run typecheck && npm run lint && npm run build
```

Плюс визуальная проверка через `npm run dev` (http://localhost:3000 → /ru):
- блок выглядит как в утверждённом прототипе;
- адаптив (≥320px, 768px, 1280px);
- **`prefers-reduced-motion: reduce`** (DevTools → Rendering → Emulate CSS prefers-reduced-motion) — анимации выключены, контент на месте.

Коммит — в конце задачи, на ветке (не в `master`/`develop` напрямую без запроса). Сообщения коммитов завершать строкой `Co-Authored-By: ...` по правилам репо.

---

# Phase 0 — Foundation (всё остальное зависит от неё)

### Task 0.1: `@theme`-токены под редизайн

**Files:**
- Modify: `app/globals.css` (блок `@theme { … }`)

- [ ] **Step 1.** В `@theme` добавить токены (вместо будущих arbitrary-значений). Имена — в стиле существующих:

```css
@theme {
  /* section rhythm */
  --color-band-soft: #f7f8f5;            /* = surface, для чередования полос */
  /* full-bleed dark sections */
  --color-founders-bg: #0b1220;          /* = ink, манифест основателей */
  /* hero ambient */
  --color-glow-emerald: #5be0a8;
  /* motion timing tokens (зеркалят motion/constants.ts для CSS-кейфреймов) */
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-reveal: 700ms;
  --dur-hover: 220ms;
  /* tilt / drift углы как переменные (для inline через className-vars нельзя — используем utility) */
  --radius-cap: 52px;                    /* высота волны-cap у full-bleed */
}
```

- [ ] **Step 2.** Verify: `npm run build` проходит; токены доступны (используются в след. задачах).
- [ ] **Step 3.** Commit: `feat(theme): add redesign tokens (bands, glow, motion, wave cap)`

---

### Task 0.2: motion-пресеты

**Files:**
- Modify: `src/06_shared/ui/motion/constants.ts`

- [ ] **Step 1.** Добавить пресеты (TS, объекты с `as const`), переиспользуя текущий стиль файла:

```ts
export const EASE = {
  outSoft: [0.22, 1, 0.36, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const REVEAL = {
  rise: { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } },
  scaleUp: { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } },
} as const;

export const STAGGER_CHILDREN = 0.08;
export const DUR_REVEAL = 0.7;
```

- [ ] **Step 2.** Verify: `npm run typecheck` + `lint`.
- [ ] **Step 3.** Commit: `feat(motion): reveal variants + ease presets`

---

### Task 0.3: shared Icon — WaveDivider, VoiceWave, GlobeIcon

**Files:**
- Create: `src/06_shared/ui/Icon/WaveDivider.tsx`
- Create: `src/06_shared/ui/Icon/VoiceWave.tsx`
- Create: `src/06_shared/ui/Icon/GlobeIcon.tsx`
- Modify: `src/06_shared/ui/index.ts` (ре-экспорт)
- Modify: `src/06_shared/ui/Icon/` barrel, если есть

- [ ] **Step 1.** `WaveDivider.tsx` — декоративная волна-cap (цвет = проп `fill`, по умолчанию `currentColor`), `aria-hidden`, `preserveAspectRatio="none"`. Используется как «шапка» цвета верхней секции, врезающая волну в full-bleed секцию:

```tsx
import type { ComponentPropsWithRef } from 'react';

type TProps = ComponentPropsWithRef<'svg'> & { fill?: string };

export const WaveDivider = ({ fill = 'currentColor', className, ...rest }: TProps) => (
  <svg
    aria-hidden="true"
    role="presentation"
    viewBox="0 0 600 52"
    preserveAspectRatio="none"
    className={className}
    {...rest}
  >
    <path d="M0,0 H600 V30 C440,-16 160,66 0,14 Z" fill={fill} />
  </svg>
);
```

- [ ] **Step 2.** `VoiceWave.tsx` — Telegram-voice бары (неровные высоты), используется в FinalCta/иконках. Декоративный, бары — `<rect>`; пульс задаётся CSS-классом снаружи (см. globals). Высоты — фикс. в `viewBox`, без arbitrary:

```tsx
import type { ComponentPropsWithRef } from 'react';

const BARS = [10, 24, 14, 30, 18, 26, 12, 22, 16]; // irregular, tg-like

type TProps = ComponentPropsWithRef<'svg'>;

export const VoiceWave = ({ className, ...rest }: TProps) => (
  <svg aria-hidden="true" viewBox="0 0 60 32" className={className} {...rest}>
    {BARS.map((h, i) => (
      <rect
        key={i}
        x={i * 6.5}
        y={(32 - h) / 2}
        width="3"
        height={h}
        rx="1.5"
        fill="currentColor"
        className="voicewave-bar"
        data-i={i}
      />
    ))}
  </svg>
);
```

- [ ] **Step 3.** `GlobeIcon.tsx` — простой глобус (line), `aria-hidden`. Стандартный 24×24 stroke-икон.
- [ ] **Step 4.** Ре-экспортировать все три из `@/shared/ui`.
- [ ] **Step 5.** Verify: `typecheck` + `lint` + `build`.
- [ ] **Step 6.** Commit: `feat(icon): WaveDivider, VoiceWave, GlobeIcon`

---

### Task 0.4: CSS keyframes (voice-pulse расширить, glow breathe, drift, wave bars)

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1.** Вне `@layer components` (чтобы не перебивались утилитами) добавить keyframes + классы, все обёрнутые в `@media (prefers-reduced-motion: no-preference)`:

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes voicewave-pulse { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
  .voicewave-bar { transform-origin: center; animation: voicewave-pulse 1.3s ease-in-out infinite; }
  .voicewave-bar[data-i="1"], .voicewave-bar[data-i="3"], .voicewave-bar[data-i="5"] { animation-delay: 0.15s; }

  @keyframes glow-breathe { 0%,100% { opacity: 0.55; transform: translateX(-50%) scale(0.92); } 50% { opacity: 1; transform: translateX(-50%) scale(1.08); } }
  .glow-breathe { animation: glow-breathe 4.5s ease-in-out infinite; }
}
```

- [ ] **Step 2.** Verify: `build`. Включить reduced-motion в DevTools — анимаций нет.
- [ ] **Step 3.** Commit: `feat(css): voice-pulse/glow keyframes (reduced-motion gated)`

---

### Task 0.5: `<Reveal>` примитив (rise / scaleUp, stagger)

**Files:**
- Create: `src/06_shared/ui/Reveal/Reveal.tsx`
- Create: `src/06_shared/ui/Reveal/index.ts`
- Modify: `src/06_shared/ui/index.ts`

- [ ] **Step 1.** Клиентский компонент-обёртка на framer-motion `whileInView`, вариант через проп; уважает reduced-motion (тогда сразу показывает). База без `opacity:0` в SSR (контент доступен):

```tsx
'use client';
import type { PropsWithChildren } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { REVEAL, DUR_REVEAL, EASE, STAGGER_CHILDREN } from '@/shared/ui/motion/constants';

type TProps = PropsWithChildren<{
  variant?: 'rise' | 'scaleUp';
  stagger?: boolean;
  className?: string;
}>;

export const Reveal = ({ variant = 'rise', stagger = false, className, children }: TProps) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const v = REVEAL[variant];
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger ? { hidden: {}, show: { transition: { staggerChildren: STAGGER_CHILDREN } } } : undefined}
      transition={stagger ? undefined : { duration: DUR_REVEAL, ease: EASE.outSoft }}
    >
      {stagger
        ? // each direct child wrapped by RevealItem (below) by consumer
          children
        : children}
    </motion.div>
  );
};
```

- [ ] **Step 2.** Добавить `RevealItem` (для stagger-детей: применяет `variants={REVEAL[variant]}`). Экспортировать оба.
- [ ] **Step 3.** Verify: `typecheck`+`lint`+`build`.
- [ ] **Step 4.** Commit: `feat(ui): Reveal + RevealItem (rise/scaleUp, stagger, reduced-motion)`

---

### Task 0.6: hooks — useParallax (курсор/скролл) и useTilt3d

**Files:**
- Create: `src/06_shared/model/hooks/useParallaxLayers.ts`
- Create: `src/06_shared/model/hooks/useTilt3d.ts`

- [ ] **Step 1.** `useTilt3d` — возвращает `ref` и `style`-motionValues (rotateX/rotateY) от позиции курсора над элементом; mouseleave → плавный возврат; reduced-motion → нейтрально. На touch — без эффекта (или gyro отдельно, опционально). Реализация на framer-motion `useMotionValue`/`useSpring`.
- [ ] **Step 2.** `useParallaxLayers` — для hero-фона: desktop — от курсора, mobile (`pointer: coarse`) — от `useScroll`. Возвращает функцию/значения сдвига для слоёв с коэффициентом глубины.
- [ ] **Step 3.** Verify: `typecheck`+`lint`.
- [ ] **Step 4.** Commit: `feat(hooks): useTilt3d, useParallaxLayers`

---

### Task 0.7: eyebrow → JetBrains Mono (единообразно)

**Files:**
- Modify: `src/06_shared/ui/SectionHead/*` (eyebrow/kicker)
- Grep & modify: все места eyebrow/crumb/kicker (`section-eyebrow`, PageHero `crumb`, PricingHero `crumb`)

- [ ] **Step 1.** Найти все eyebrow-классы: `grep -rn "eyebrow\|section-eyebrow\|crumb\|kicker" src app/globals.css`.
- [ ] **Step 2.** Привести их к `font-mono` (Tailwind `font-mono` = токен `--font-mono`). Если класс в globals — добавить `font-family: var(--font-mono)`.
- [ ] **Step 3.** Verify: визуально eyebrow во всех секциях — моноширинный.
- [ ] **Step 4.** Commit: `style(eyebrow): unify to JetBrains Mono across sections`

---

# Phase 1 — Global shell + header

### Task 1.1: Section rhythm — чередование фона + full-bleed + волна

**Files:**
- Modify: `src/06_shared/ui/Section/*` (добавить пропы `tone` и `bleed`)
- Modify: `app/globals.css` (утилиты полос/буллет full-bleed, вне `@layer components`)

- [ ] **Step 1.** Расширить `Section`: проп `tone?: 'white' | 'soft'` (фон секции — белый/`--color-band-soft`), `bleed?: 'founders' | 'cta'` (full-bleed цветная: ink-navy / emerald-gradient, ломает контейнер на всю ширину, сверху — `<WaveDivider fill="<цвет верхней секции>" />`).
- [ ] **Step 2.** Full-bleed реализовать без inline-style: utility-классы в globals (`.section-bleed-founders`, `.section-bleed-cta`) с фоном-токеном/градиентом; ширина — через существующий приём контейнера (100vw break-out утилитой). Волна-cap позиционируется абсолютно сверху, цвет = верхняя секция.
- [ ] **Step 3.** Verify: собрать тестовую страницу-песочницу или применить на главной (Task 2.x) — full-bleed край-в-край, волна без шва.
- [ ] **Step 4.** Commit: `feat(section): tone bands + full-bleed + wave cap`

### Task 1.2: Header — центрированная навигация

**Files:**
- Modify: `src/03_widgets/site-header/ui/*`

- [ ] **Step 1.** Раскладка: логотип слева · `nav` по центру (Как работает / Цены / FAQ) · справа дропдаун языка + primary CTA. Десктоп — grid/flex с центральной зоной; мобилка — бургер (как сейчас).
- [ ] **Step 2.** Hover ссылок меню — подчёркивание из-под слева (scaleX, origin left) через CSS (псевдоэлемент), `@media(hover:hover)`. Активный пункт — постоянное подчёркивание.
- [ ] **Step 3.** Verify + commit: `feat(header): centered nav + underline hover`

### Task 1.3: Language switcher — дропдаун

**Files:**
- Modify: `src/04_features/locale-switch/ui/LocaleSwitch.tsx`
- Create: `src/04_features/locale-switch/model/hooks/useDropdown.ts`

- [ ] **Step 1.** Триггер `GlobeIcon + код (RU/UA/EN) + каретка` (emerald, поворот 180° на open). Меню — полные названия (Русский/Українська/English), активный подсвечен, ссылки — locale-aware `Link` из `@/shared/model/libs/i18n/navigation`.
- [ ] **Step 2.** `useDropdown` (в `model/hooks/`): open-state, закрытие по Esc/клику-вне, `aria-expanded`/`role`/клавиатура. Анимация меню — framer-motion `AnimatePresence` (scale+opacity из угла, stagger пунктов); reduced-motion → мгновенно.
- [ ] **Step 3.** Verify (клавиатура + screen reader-метки) + commit: `feat(locale-switch): dropdown with globe + animated menu`

---

# Phase 2 — Home (`src/02_pages/home` + виджеты)

> Каждая секция оборачивается в `Section` с нужным `tone`; reveal — `<Reveal variant="rise">` (карточные сетки — `scaleUp`+stagger). После каждой — verify + commit.

### Task 2.1: Hero — фон A3, телефон 3D, badges, title-reveal
**Files:** `src/03_widgets/home-hero/ui/*` (HeroBgParallax, HomePhonePreview, FloatingBubbleCards, HeroTitle), новый `HeroTitleReveal`.
- [ ] Фон: переписать `HeroBgParallax` на параллакс-сетку + `VoiceWave`/voice-line иконки (бледные), `useParallaxLayers` (курсор desktop / скролл mobile).
- [ ] Телефон: обернуть `HomePhonePreview` в `useTilt3d`-контейнер (3D-наклон к курсору), side-карточки (`FloatingBubbleCards`) — приподнять `translateZ` + прилёт-как-badges (приземление сразу на resting-наклон, потом дрейф). Внутрянка чата — статична. `BreathingPhone` idle сохранить.
- [ ] Eyebrow — `RotatingStatus` (ротация, как есть), мета-пункты — без изменений.
- [ ] `HeroTitle` → letter blur-reveal on-load (split на буквы `inline-block`, `blur(12px)→0 + opacity + translateY(.32em)`, stagger ~0.03s; reduced-motion → сразу). Слова не рвутся.
- [ ] Verify (вкл. mobile parallax, reduced-motion) + commit.

### Task 2.2: PainMirror — сплит + парящие пузыри
**Files:** `src/03_widgets/home-pain-mirror/ui/*`
- [ ] Двухколоночный сплит: слева eyebrow+H2+мостик; справа чат-тред. Все пузыри — наклон ±1–2° + тень; финальный пузырь бота emerald; чипы-сценарии — парящие пузырьки-кнопки (ссылки в бота).
- [ ] Reveal пузырей: прилёт/появление при входе во вьюпорт со stagger → дрейф; reduced-motion → статика. Мобилка: заголовок сверху, пузыри стопкой.
- [ ] Verify + commit.

### Task 2.3: HowItWorks «Как тренируешься» — таймлайн с нодами
**Files:** `src/03_widgets/home-how-it-works/ui/*`, `src/05_entities/step-card/*` (при необходимости новый вид).
- [ ] Горизонтальный таймлайн: 4 mono-ноды на линии прогресса, заголовок+описание под каждой, последняя нода акцентная. Мобилка — вертикаль. Reveal `rise`+stagger.
- [ ] Verify + commit.

### Task 2.4: ScenariosGrid «8 ситуаций» — editorial-строки + iOS-wheel
**Files:** `src/03_widgets/home-scenarios-grid/ui/*`, hook `model/hooks/useWheelFocus.ts`.
- [ ] Широкие строки (mono-номер + название + роль/длительность), ссылки в бота. Хук `useWheelFocus` (или CSS `animation-timeline: view()`): scale/opacity/rotateX от позиции к центру; фокусная — крупная/белая/тень, **хук всегда занимает место, меняется только opacity** (без layout-сдвига). reduced-motion → статичный список.
- [ ] Verify (reduced-motion = список) + commit.

### Task 2.5: Advantages «Что внутри» — bento с якорем
**Files:** `src/03_widgets/home-advantages/ui/*`, `src/05_entities/advantage-tile/*`.
- [ ] Bento: якорь 2×2 («говоришь голосом» + `VoiceWave`-визуал), вокруг feature/outcome-плитки, золотая плитка цены. Якорь ~2× площади. Мобилка — 1 колонка, якорь первым. Reveal `scaleUp`+stagger.
- [ ] Verify + commit.

### Task 2.6: FounderCards — тёмный манифест (full-bleed) + волна
**Files:** `src/03_widgets/home-founder-cards/ui/*`.
- [ ] `Section bleed="founders"` (ink-navy, full-bleed, сверху волна цвета верхней секции). Контент: eyebrow → крупное заявление → общая история → разделитель → 2 мини-истории (аватар-инициалы, имя, роль, 1–2 строки, Telegram-ссылка). Blob-glow emerald. Мобилка — стопкой.
- [ ] Verify (волна без шва, full-bleed) + commit.

### Task 2.7: PricingCard — приподнятая сплит-панель + переключатель цены
**Files:** `src/03_widgets/home-pricing-card/ui/*`, `src/05_entities/pricing-card/*` (split-вариант), feature `src/04_features/price-toggle/` (хук + UI).
- [ ] Сплит-панель: слева emerald-градиент (бейдж+цена+CTA+risk), справа белая «Что входит». Акцентная карта (приподнята над полосой).
- [ ] `price-toggle` (client, хук в `model/hooks/`): сегмент месяц/день/vs кофе; **число пересчитывается на месте** (rAF-счётчик, `useMotionValue`+`animate`), **юнит и подпись меняются мгновенно**; thumb переезжает. reduced-motion → сразу финал. Значения честные (£9.90/£0.33/«дешевле латте»).
- [ ] Verify + commit.

### Task 2.8: FinalCta — emerald full-bleed + волна + voice-пульс + glow
**Files:** `src/03_widgets/final-cta-section/ui/*` (общий виджет).
- [ ] `Section bleed="cta"` — emerald-градиент, единый непрерывный фон; волна-cap сверху цвета верхней секции (без шва). `VoiceWave` (Telegram-voice) с пульсом (`.voicewave-bar`), glow `.glow-breathe` из-за волны. Заголовок + CTA (primary, ghost-hover) + мета.
- [ ] Verify на всех страницах, где используется FinalCta + commit.

### Task 2.9: HomePage — собрать tone/Reveal по секциям
**Files:** `src/02_pages/home/ui/HomePage.tsx`
- [ ] Проставить `tone` (чередование white/soft), full-bleed для Founders/FinalCta, обернуть секции в `Reveal`. Проверить общий ритм страницы и волны в 2 местах.
- [ ] Verify (вся главная, адаптив, reduced-motion) + commit.

---

# Phase 3 — /pricing (`src/02_pages/pricing` + виджеты)

### Task 3.1: PricingHero — офферный, letter-reveal
**Files:** `src/03_widgets/pricing-hero/ui/*`
- [ ] Crumb (mono) «Тарифы» + H1 «Один план. Всё внутри.» (letter blur-reveal on-load) + подзаголовок + CTA. **Убрать risk-строку и цену-reframe** (живут в карточке). Сохранить SoftwareApplication/Offer JSON-LD.
- [ ] Verify + commit.

### Task 3.2: PricingTrustStrip — парящие пилюли
**Files:** `src/03_widgets/pricing-trust-strip/ui/*`
- [ ] 4 пилюли с наклоном+тенью; прилёт-как-badges при входе во вьюпорт → дрейф. Verify + commit.

### Task 3.3: PricingPlanCard — как на главной (split + price-toggle)
**Files:** `src/03_widgets/pricing-plan-card/ui/*`
- [ ] Переиспользовать split-вариант `pricing-card` + `price-toggle` (Task 2.7). Verify + commit.

### Task 3.4: PricingUnitEconomics — donut ring-chart
**Files:** `src/03_widgets/pricing-unit-economics/ui/*`
- [ ] Заменить таблицу на donut: CSS `conic-gradient` (цвета — токены, без arbitrary) либо shared `Icon`; центр «£9.90»; легенда (STT/LLM/TTS/инфра); маржа — акцент gold. Опц. раскрытие в таблицу (details). Reveal `scaleUp`. Verify + commit.

### Task 3.5: PricingComparisonContext — матрица сравнения
**Files:** `src/03_widgets/pricing-comparison-context/ui/*`
- [ ] Десктоп — полная матрица «критерии × {Репетитор, Приложение, Мы}», наш столбец `primary-pale`, ✓/— (`CheckIcon`/dash). Мобилка (M1) — компактные иконо-ячейки (~46px узкие колонки, сокращённые заголовки), **влезает в 320px без горизонтального скролла**. Verify на 320px + commit.

### Task 3.6: PricingPage — tone/Reveal/волна перед FinalCta
**Files:** `src/02_pages/pricing/ui/PricingPage.tsx` — проставить tone, Reveal; FinalCta уже full-bleed+волна. Verify + commit.

---

# Phase 4 — /how-it-works (`src/02_pages/how-it-works`)

### Task 4.1: PageHero — шелл как pricing + стат-пилюли C + waveform-mask
**Files:** `src/03_widgets/page-hero/ui/PageHero.tsx`, `HeroWaveformDecoration.tsx`
- [ ] Hero-шелл как PricingHero (crumb mono + H1 letter blur-reveal + подзаголовок, центр, градиент); контент-заголовок страницы — как сейчас.
- [ ] Стат-блок → парящие стат-пилюли (7 сценариев UK-жизни / 15 минут в день / RU·UA фидбек на родном; цифры — JetBrains Mono; прилёт-как-badges → дрейф).
- [ ] **`HeroWaveformDecoration` (hero-waveform-mask) — оставить с текущей анимацией** (не трогать).
- [ ] Verify + commit.

### Task 4.2: how-it-works page — tone/Reveal; Flow и «Что считается» без изменений (только tone/оболочка)
**Files:** `src/02_pages/how-it-works/ui/HowItWorksPage.tsx`
- [ ] Проставить tone, Reveal-обёртки; `FlowSectionWithPhone` и `PrivacyFeatureGrid` — внутренняя раскладка не меняется. Volна перед FinalCta. Verify + commit.

---

# Phase 5 — Legal, нижний блюр, hover-система, финальный QA

### Task 5.1: Legal — упрощённая типографика
**Files:** `src/03_widgets/legal-page-layout/*`, `src/03_widgets/legal-toc/*`
- [ ] Только типографика внутри полосы-оболочки: заголовки + абзацы, **без код-блоков и лишней стилизации**; читаемая ширина, ритм. Структуру/ToC не перестраивать. Проверить privacy/terms/cookies/disclaimer. Verify + commit.

### Task 5.2: Нижний прогрессивный блюр
**Files:** Create `src/03_widgets/scroll-blur/ui/ScrollBlur.tsx` + hook `model/hooks/useNearPageEnd.ts`; смонтировать в `app/[locale]/layout.tsx`.
- [ ] Фикс-полоса у низа вьюпорта: `backdrop-filter: blur` + `mask`-градиент (сильнее у низа) — классы в globals (вне `@layer components`). `useNearPageEnd`: `opacity→0` в пределах ~120px до конца; на коротких страницах (нет скролла) — скрыт. `@supports (backdrop-filter)` + reduced-motion → выключен. Client component.
- [ ] Verify (короткая и длинная страницы, конец страницы) + commit.

### Task 5.3: Hover-система — secondary/tertiary кнопки, футер
**Files:** `src/06_shared/ui/Button*`/`ButtonLink`, `src/03_widgets/site-footer/*`
- [ ] Primary CTA — ghost-hover (заливка→transparent, бордер+текст остаются; бордер 2px всегда). Secondary (outline) — hover заливка primary + белый текст. Tertiary/текстовая — подчёркивание из-под слева. Футер-ссылки — смена цвета → primary. Карточки — подъём -4px+тень+emerald-рамка; строки-сценарии — сдвиг+стрелка. Всё CSS, `@media(hover:hover)`, `:active`, reduced-motion → мгновенно.
- [ ] Verify + commit.

### Task 5.4: Финальный QA-проход
- [ ] `npm run typecheck && npm run lint && npm run build` — zero warnings.
- [ ] Прокликать все 3 страницы + legal: адаптив (320/768/1280), reduced-motion (все анимации off, контент на месте), клавиатурная навигация (дропдаун языка, ссылки), отсутствие layout-сдвигов (wheel-хук, title-reveal).
- [ ] Проверить, что не появились: inline `<svg>`, arbitrary Tailwind, inline `style={{}}` — `grep -rn "style={{" src` / `grep -rn "\\[#" src`.
- [ ] Commit финальных правок: `chore: redesign QA pass`.

---

## Self-review заметки
- Каждая фаза самодостаточна: Phase 0 даёт примитивы; 1 — каркас; 2/3/4 — страницы; 5 — отделка. Можно отгружать по фазам.
- Анимационный роадмап репо (L1–L6, `docs/SESSION_HANDOFF.md`) поглощён фазами 2–5; схему «одна анимация → ack» сохранять при ревью между задачами.
- Спорные по перфу места (`backdrop-filter` блюр, blur-reveal заголовков, 3D-tilt) — применять точечно; проверять на слабом железе.
