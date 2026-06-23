# Site Animations — Design Spec

**Date:** 2026-05-21
**Status:** Approved for implementation planning
**Owner:** Dmitriy
**Related:** [`2026-05-13-speakmove-landing-design.md`](./2026-05-13-speakmove-landing-design.md)

---

## 1. Goals

1. Перевести лендинг SpeakMove из статичного состояния в premium-restrained motion-режим (Apple / Linear / Vercel vibe) — без awwwards-перебора и без playful Duolingo-эстетики.
2. Внедрить «звёздный» эффект: единый CSS-3D-телефон, который из hero **путешествует** к scenarios-секции (sticky слева, контент чата меняется на каждую из 8 ситуаций при дальнейшем scroll). Один DOM-узел, scroll-driven transforms — не «два phone, склеенных sticky-handoff».
3. Покрыть остальные секции тонким scroll-reveal-механизмом (`fade-up`) через единый wrapper, без боилерплейта.
4. Усилить background motion в hero (grid parallax сейчас «слабо ощущается»), добавить ambient blob и pulse под finale CTA.
5. Добавить smooth scroll (Lenis) только для десктопа.
6. Соблюдать a11y- и perf-бюджеты строго (см. §3).

## 2. Non-goals

- **Page transitions** между маршрутами — не делаем (выбор: мгновенный переход).
- **react-three-fiber / WebGL phone** — отвергнуто (см. §4 «Phone tech rationale»).
- **PNG-sequence Apple-style** — отвергнуто.
- **Animated mesh gradient между секциями** — отвергнуто (рвёт фокус с phone).
- **Character-by-character / scramble / glitch typography** — отвергнуто.
- **3D phone journey на мобиле** — отвергнуто (см. §3, mobile profile).
- **Юнит/E2E-тесты** — out of scope, как и для всего проекта (CLAUDE.md, ссылка на §13 base-spec).

## 3. A11y & Performance budgets

| Параметр | Значение | Источник правила |
|---|---|---|
| `prefers-reduced-motion: reduce` | Все scroll/idle/hover-motion отключаются полностью; контент мгновенно в финальном состоянии | WCAG 2.3.3 |
| LCP target | ≤ 2.5s на 4G / Moto G4 | Web Vitals «Good» |
| INP target | ≤ 200ms | Web Vitals «Good» |
| CLS target | ≤ 0.1 | Hero phone и H1 рендерятся в финальной layout-позиции; motion применяется только через `transform`, не через `top/left/margin/width` |
| Bundle cap (новый JS gzip) | ≤ 20 KB | framer-motion уже стоит; новые deps только `lenis` (~5 KB) |
| Mobile (`viewport < 1024px`) motion profile | Без 3D-phone journey, без sticky scenarios, без H1 word-stagger (whole-block fade), без Lenis | Реальные мобилы — touch-scroll, отвлекать heavy motion = вред |
| CSP | Никакого `unsafe-inline` в production; все keyframes — в `app/globals.css` | CLAUDE.md §Security headers |
| SSR-safety | initial render = финальное состояние motion (для CLS/LCP/SEO); анимация применяется только после client mount | next-intl + RSC default |

**Reduced-motion контракт реализуется через `useReducedMotion()` из framer-motion + CSS `@media (prefers-reduced-motion: reduce)` для keyframes.**

## 4. Tech stack

| Что | Зачем | Размер (gzip) | Статус |
|---|---|---|---|
| `framer-motion` | scroll-driven transforms, `useScroll`, `useTransform`, `whileInView`, `useReducedMotion`, `AnimatePresence` | уже стоит (12.39.0) | использовать |
| `lenis` | smooth scroll, desktop-only, off при reduced-motion | ~5 KB | новая зависимость |
| CSS keyframes в `app/globals.css` | idle motion (grid parallax усиление, blob drift, CTA pulse, accent-underline draw) | 0 KB JS | использовать |
| `three.js` / `react-three-fiber` | — | — | **не использовать** |

### Phone tech rationale

Выбрана **CSS 3D proxy** на текущем `PhoneMockup` (HTML + CSS `perspective` + `transform: rotateY/X/translate`):

- Сохраняет i18n/a11y/SEO контент чата (real HTML), что критично — чат рендерит сообщения из `messages/{ru,uk,en}.json`.
- 0 новых JS-зависимостей.
- ~85% визуального эффекта референсов (La Revoltosa, Hydroflow) при ~5% сложности альтернатив.
- Real-3D (r3f) даёт +600 KB и не поможет с HTML-чатом внутри корпуса; PNG-sequence убивает i18n (контент впечён в кадры).

## 5. Architecture (6 independent modules)

Каждый модуль имеет один публичный API и не знает о других, кроме явных контрактов через DOM-якоря.

### 5.1 `<Reveal>` — `src/06_shared/ui/Reveal/`

Универсальный scroll-in fade wrapper.

**Public API:**

```tsx
<Reveal variant="up" delay={0} stagger={0} once={true}>
  ...children
</Reveal>
```

**Variants:** `up` (default, y: 24→0), `left` (x: -24→0), `right` (x: 24→0), `scale` (scale: 0.96→1), `fade-only`.

**Mechanics:**

- `motion.div` из framer-motion с `initial`, `whileInView`, `viewport={{ once, amount: 0.25 }}`.
- Duration: 600ms.
- Easing: `MOTION_EASE.out` (уже экспортируется из `@/shared/ui`).
- Reduced-motion: `initial={false}`, animation не запускается, конечное состояние сразу.
- Stagger mode: если `stagger > 0` и `children` — массив, оборачиваем каждый ребёнок с `delay: i * stagger`.
- SSR: initial visual state == final state (opacity 1, transforms identity) до hydration → нет flash-of-invisible-content и нет CLS; после client mount применяется `initial`, и whileInView отрабатывает на следующий scroll.

**Где применяется:** см. §6 таблицу.

### 5.2 `PhoneJourney` — `src/03_widgets/phone-journey/`

Новый widget. Главный механизм. Единственный экземпляр PhoneMockup в DOM, который scroll-driven путешествует между двумя anchor-точками.

**Composition:**

```
app/[locale]/layout.tsx
  └── LenisProvider
      └── PhoneJourney (client, fixed layer, рендерится один раз на root)
      └── children
            ├── HomeHero
            │     └── PhoneJourneyMount role="source" (anchor #1)
            ├── … middle sections …
            └── HomeScenariosGrid
                  └── PhoneJourneyMount role="target" (anchor #2)
```

**Public API:**

```tsx
// Root mount (один на приложение)
<PhoneJourney />

// Anchor mount (минимум 2 на странице, либо ноль — тогда PhoneJourney не рендерится)
<PhoneJourneyMount role="source" />
<PhoneJourneyMount role="target" />
```

**Mechanics:**

- На lg+ (viewport ≥ 1024px) PhoneJourney монтируется в root client-layer как `position: fixed`, изначально hidden (opacity 0).
- При mount каждый `PhoneJourneyMount` регистрируется в shared store (custom React context или Zustand-mini — решает `writing-plans`) с своим `ref` и `role`.
- PhoneJourney через `useScroll({ container: window })` + `useTransform` маппит `scrollY` на:
  - **Stop A** (source anchor visible, scrollY ≈ 0): bounding rect от `PhoneJourneyMount[role=source]` → `{ x, y, scale: 1, rotateY: 0 }`.
  - **Stop B** (target anchor reached): bounding rect от `PhoneJourneyMount[role=target]` → `{ x, y, scale: 0.8, rotateY: -6deg }`.
  - Линейная интерполяция в диапазоне `[A.scrollY, B.scrollY]`.
- Bounding rects пересчитываются на `resize` и `scroll` (last-known via `ResizeObserver` + `IntersectionObserver` для дешёвой инвалидации).
- В hero (scrollY ≈ 0): idle motion `rotateY: -3 ↔ 3deg`, autoplay loop 8s, `ease-in-out`. Останавливается, когда scroll начинается.
- В scenarios (scrollY ≥ B.scrollY): включается вложенный scroll-driver scenarios-секции. Активная карточка (из 8) определяется через свой `useScroll({ target: scenariosRef, offset: ['start start', 'end end'] })`. На каждый stop — `AnimatePresence mode="wait"` обновляет `messages` в PhoneMockup.

**CSS 3D:**

- Wrapper-узел получает `style={{ perspective: '1200px' }}` (через CSS class в `globals.css`, не inline — feedback `no_inline_style`).
- Inner phone-frame: `transform: translateX(...) translateY(...) scale(...) rotateY(...)`.
- transform-origin: center center.

**Mobile profile (`< lg`):**

- `PhoneJourney` **не рендерит fixed-layer**, возвращает `null`.
- `PhoneJourneyMount` **не рендерит якорь**, возвращает `null`.
- В `HomeHero` (mobile branch) рендерится inline `<HomePhonePreview />` как сейчас.
- В `HomeScenariosGrid` (mobile branch) — `<ul>` карточек с `<Reveal variant="up" stagger={0.05}>`, без sticky-phone.
- Разделение mobile/desktop через CSS-классы (`hidden lg:block`/`lg:hidden`) и условный рендер `useMediaQuery('(min-width: 1024px)')` внутри client-components — SSR рендерит mobile-вариант, desktop включается после hydration через CSS-class swap.

**Reduced-motion:**

- PhoneJourney монтируется, но scrollY-driven transforms заменяются на ступенчатые: phone виден в позиции source до scrollY ≥ B.scrollY, потом display: none.
- Idle motion отключён.
- Content swap (`AnimatePresence`) — без motion, мгновенная смена.

**Контент phone:**

- Hero default: текущие `messages` из `HomePage.hero.phonePreview` (i18n).
- Scenarios stops: contents из `HomeScenariosGrid` per-card mapping. Уже есть `SCENARIO_PHONE_CONTENT` в `src/03_widgets/home-scenarios-grid/model/phone-content.ts` (из удалённого `ScenariosScrollClient` — pattern переезжает в `PhoneJourney`).

**Accessibility:**

- PhoneJourney обёртка — `aria-hidden="true"`, как и текущий `HomePhonePreview` (декоративный mockup, не основной контент).
- Основной контент (заголовки, описания сценариев, CTA) остаётся в HomeScenariosGrid карточках как plain HTML, читается screen-reader'ами и индексируется.

### 5.3 `LenisProvider` — `src/06_shared/ui/LenisProvider/`

Smooth scroll, только desktop.

**Public API:**

```tsx
<LenisProvider>{children}</LenisProvider>
```

**Mechanics:**

- Client component.
- Активна **только** при: `window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- На mobile / reduced-motion → возвращает `{children}` без обёртки, без JS-cost.
- При активации: `new Lenis({ smoothTouch: false, duration: 1.2 })`, RAF loop на `lenis.raf`.
- Anchor-link click handler: перехватывает clicks по `a[href^="#"]` (delegation на document), вызывает `lenis.scrollTo(target, { offset: -headerHeight })`. `headerHeight` берётся из CSS-переменной `--header-height`, которая **добавляется в этом спринте** в `:root` блок `app/globals.css` (значение синхронизировано с `SiteHeader` высотой, ~64px desktop / ~56px mobile через `@media`).
- Cleanup на unmount: `lenis.destroy()`, removeEventListener.
- `framer-motion useScroll` совместима: framer-motion полагается на native scroll-events, Lenis их корректно эмитит.

### 5.4 Hero ambient motion (усиление существующего + новое)

**HeroBgParallax (переписать):**

- Сейчас: `y: 0 → 160px` на scrollY 0..800.
- Станет: `y: 0 → 320px`, `opacity: 1 → 0.4`, `scale: 1 → 1.15` на scrollY 0..800.
- Reduced-motion: без transforms (static).
- Усиление амплитуды + opacity-shift делает эффект заметным («сейчас слабо ощущается» — feedback пользователя).

**Hero ambient blob (новый):**

- Pure CSS, `position: absolute`, `width/height: 480px`, `border-radius: 50%`, `background: radial-gradient(closest-side, var(--color-primary) / 18%, transparent 70%)`, `filter: blur(80px)`.
- **Z-index ordering в hero:** `.hero-bg-grid` (z 0) → blob (z 1) → hero content + phone (z 10). Все 3 слоя — siblings под `position: relative` родителя `<header>`.
- `animation: blob-drift 24s infinite alternate ease-in-out` — translate ±40px по X и Y.
- `aria-hidden`, отключается через `@media (prefers-reduced-motion: reduce)`.
- Размещается в `HomeHero` рядом с `<HeroBgParallax />`.

### 5.5 H1 word-stagger + accent-underline draw

**`HeroTitle` — `src/03_widgets/home-hero/ui/HeroTitle.tsx`:**

- Client component (нужен `useEffect` для mount-flag).
- Принимает props: `before: string`, `accent: string`, `after: string`.
- Рендерит H1 → split каждой части по словам → каждое слово как `motion.span` с inline-block.
- `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, transition: `{ delay: i * 0.06, duration: 0.5, ease: MOTION_EASE.out }`.
- **SSR initial**: до mount компонент рендерит plain `<h1>` с full content в финальном визуальном состоянии (opacity:1, y:0) — критично для LCP и SEO. Только после `mounted=true` (через `useEffect`) переключается на motion-spans.
- Reduced-motion: `mounted` остаётся false navсегда → plain text.
- `aria-label={fullText}` на h1, чтобы screen-reader читал цельный заголовок, а не пословно.

**Accent-underline draw:**

- `.accent-underline::after` уже определён в `globals.css` (line 506). Добавить:
  - default state: `transform: scaleX(0); transform-origin: left center;`
  - keyframe `accent-draw` from `scaleX(0)` to `scaleX(1)`, duration 800ms, easing `ease-out`.
  - apply animation through class `.accent-underline.is-drawn::after { animation: accent-draw 800ms ease-out forwards; }`.
  - класс `.is-drawn` добавляется через `HeroTitle` после mount + delay равный `(wordCount * 60ms + 200ms)` (после H1 reveal).
- Reduced-motion: `@media (prefers-reduced-motion: reduce) { .accent-underline::after { transform: scaleX(1); animation: none; } }`.

### 5.6 Finale CTA pulse

- В `FinalCtaSection`: новый span `.cta-pulse-glow` под primary-кнопкой, `position: absolute`, радиальный gradient, blur.
- `animation: cta-pulse 4s infinite ease-in-out` (scale 1.0 → 1.05, opacity 0.6 → 0.95).
- Pure CSS, без JS. Reduced-motion: `animation: none`, `opacity: 0.7` static.

## 6. Section behavior map

| Секция | `<Reveal>` | H1 word-stagger | Accent-underline | Background motion | PhoneJourney | Lenis |
|---|---|---|---|---|---|---|
| Hero | — (visible с mount) | ✅ | ✅ | grid parallax + blob | source anchor | applies |
| Pain Mirror | up | — | — | — | — | applies |
| How It Works | up + stagger 0.05 | — | — | — | — | applies |
| Advantages | up + stagger 0.05 | — | — | — | — | applies |
| Founder Cards | up + stagger 0.05 | — | — | — | — | applies |
| Scenarios (desktop) | up (outer header) | — | — | — | target anchor + 8 stops | applies |
| Scenarios (mobile) | up + stagger 0.05 (cards) | — | — | — | — | n/a |
| Pricing Card | up | — | — | — | — | applies |
| FAQ | up + stagger 0.04 | — | — | — | — | applies |
| Final CTA | up | — | — | CTA pulse | — | applies |
| Footer | — (visible сразу) | — | — | — | — | applies |

**Secondary pages (`/pricing`, `/how-it-works`):** `<Reveal>` на каждый widget после hero. `PhoneJourney` не монтируется (нет якорей).

**Legal pages, 404, error:** без анимаций (контент-функциональные страницы).

## 7. File changes

### Delete

- `src/03_widgets/home-hero/ui/BreathingPhone.tsx` ✅ done
- `src/03_widgets/home-scenarios-grid/ui/ScenariosScrollClient.tsx` ✅ done

### Create

- `src/06_shared/ui/Reveal/Reveal.tsx`
- `src/06_shared/ui/Reveal/index.ts`
- `src/06_shared/ui/LenisProvider/LenisProvider.tsx`
- `src/06_shared/ui/LenisProvider/index.ts`
- `src/03_widgets/phone-journey/index.ts`
- `src/03_widgets/phone-journey/ui/PhoneJourney.tsx`
- `src/03_widgets/phone-journey/ui/PhoneJourneyMount.tsx`
- `src/03_widgets/phone-journey/model/hooks/usePhoneJourneyAnchor.ts`
- `src/03_widgets/phone-journey/model/hooks/usePhoneJourneyScroll.ts`
- `src/03_widgets/phone-journey/model/store.ts` (anchor registry — decision deferred to writing-plans: либо React Context + useRef-based registry, либо мини zustand-store; критерий: минимизировать re-renders при scroll)
- `src/03_widgets/phone-journey/model/types.ts`
- `src/03_widgets/home-hero/ui/HeroTitle.tsx`

### Modify

- `app/[locale]/layout.tsx` — обернуть в `<LenisProvider>`, добавить `<PhoneJourney />`
- `app/globals.css` — keyframes `blob-drift`, `accent-draw`, `cta-pulse`; усиление `.hero-bg-grid`; `accent-underline::after` initial scaleX(0); media-queries `prefers-reduced-motion`
- `src/06_shared/ui/index.ts` — добавить barrel exports `Reveal`, `LenisProvider`
- `src/03_widgets/home-hero/ui/HomeHero.tsx` — заменить inline H1 на `<HeroTitle>`, добавить `<PhoneJourneyMount role="source">` (lg+), сохранить `<HomePhonePreview>` для mobile
- `src/03_widgets/home-hero/ui/HeroBgParallax.tsx` — усилить амплитуды (y, opacity, scale)
- `src/03_widgets/home-scenarios-grid/ui/HomeScenariosGrid.tsx` — на lg+ перерисовать в формат scroll-container с 8 stops + `<PhoneJourneyMount role="target">`; mobile — текущий grid; перенести `SCENARIO_PHONE_CONTENT` в state, доступный для `PhoneJourney`
- `src/03_widgets/final-cta-section/ui/FinalCtaSection.tsx` — добавить `<span class="cta-pulse-glow" aria-hidden />` под кнопкой
- `src/03_widgets/pain-mirror/ui/HomePainMirror.tsx` + how-it-works + advantages + founder-cards + pricing-card + faq-section — обернуть содержимое в `<Reveal>`
- `package.json` — добавить `lenis`

### Dependencies

```bash
npm install lenis
```

## 8. Phasing (порядок имплементации)

Каждая фаза — independent shippable unit. Между фазами `npm run build` + `npm run lint` + `npm run typecheck` обязательно зелёные.

### Phase 1 — Foundation: `<Reveal>` + `LenisProvider`

- Создать `Reveal` (компонент + barrel).
- Создать `LenisProvider` (компонент + barrel + `npm install lenis`).
- Обернуть `app/[locale]/layout.tsx` в `LenisProvider`.
- Обернуть содержимое всех non-hero секций (8 widgets) в `<Reveal>`.
- Acceptance: при скролле по главной все секции плавно появляются; на десктопе скролл инерционный; на мобиле — нативный; reduced-motion — всё мгновенно.

### Phase 2 — Typography: `HeroTitle` + accent-underline draw

- Создать `HeroTitle.tsx`.
- Обновить `HomeHero.tsx` — заменить inline H1.
- Добавить keyframe `accent-draw` и initial state в `globals.css`.
- Acceptance: на reload главной H1 пословно появляется, underline дорисовывается; LCP не деградирует (SSR initial = visible).

### Phase 3 — Background motion: усиление grid + blob + CTA pulse

- Переписать `HeroBgParallax` (амплитуды).
- Добавить blob-элемент в `HomeHero` + keyframe `blob-drift` в globals.css.
- Добавить `.cta-pulse-glow` в `FinalCtaSection` + keyframe `cta-pulse` в globals.css.
- Все 3 эффекта под `@media (prefers-reduced-motion: reduce)` отключаются.
- Acceptance: grid parallax чётко заметен; в hero под phone «дышит» blob; под finale CTA пульсирует glow.

### Phase 4 — PhoneJourney (главный риск)

- Создать FSD slice `phone-journey/` (полный состав, см. §7).
- Обновить `HomeHero` — добавить `<PhoneJourneyMount role="source">` (lg+ branch).
- Обновить `HomeScenariosGrid` — на lg+ перерисовать как long scroll-container с `<PhoneJourneyMount role="target">` слева; на mobile оставить старый grid.
- Обновить `app/[locale]/layout.tsx` — добавить `<PhoneJourney />` после LenisProvider.
- Перенести `SCENARIO_PHONE_CONTENT` в публичный API scenarios-widget (или в общий model-слой).
- Acceptance:
  - На desktop: при скролле phone из hero плавно движется/уменьшается, к началу scenarios находится слева;
  - В scenarios: при дальнейшем скролле активная карточка из 8 меняется, контент чата в phone обновляется через AnimatePresence;
  - На mobile: phone в hero статичный, scenarios — grid карточек с reveal-stagger;
  - reduced-motion: phone в hero статичный, при scrollY ≥ B исчезает, контент чата меняется мгновенно.

### Phase 5 — Cleanup + audit

- `npm run build` — zero warnings обязательно.
- Bundle analysis: `next build` output, проверить +JS gzip ≤ 20 KB.
- Lighthouse main page (desktop + mobile): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Удалить любые «лохматые хвосты» (неиспользуемые imports, мёртвые типы).
- Acceptance: lighthouse зелёный, build clean, нет console warnings в dev.

## 9. Acceptance criteria (целиком)

Лендинг считается «оживлённым» при выполнении всех:

1. ✅ На главной при скролле каждая секция плавно появляется через fade-up.
2. ✅ Hero H1 пословно появляется при загрузке, underline дорисовывается.
3. ✅ Grid parallax в hero **чётко заметен** (не «слабо»).
4. ✅ Под phone в hero плавает мягкий blob.
5. ✅ Под finale CTA пульсирует glow.
6. ✅ Desktop: phone из hero **путешествует** к scenarios-секции, контент чата меняется на каждую из 8 ситуаций.
7. ✅ Mobile: упрощённый профиль — без journey, без word-stagger.
8. ✅ Reduced-motion: все motion-эффекты отключаются, контент мгновенно в финальном состоянии.
9. ✅ Desktop без reduced-motion: smooth scroll работает на anchor-links.
10. ✅ LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, новый JS +gzip ≤ 20 KB.
11. ✅ `npm run build`, `lint`, `typecheck` — zero warnings.
12. ✅ Никаких inline `<svg>`, inline `style={{}}`, arbitrary Tailwind values (`text-[..px]`).
13. ✅ FSD slice isolation соблюдена: `phone-journey` не импортирует `home-hero`/`home-scenarios-grid`, и наоборот — anchors общаются через shared registry.

## 10. Risks & mitigations

| Риск | Вероятность | Impact | Mitigation |
|---|---|---|---|
| PhoneJourney bounding-rect math ломается при resize/orientation change | M | H | `ResizeObserver` на оба anchor; debounced recompute; fallback на `getBoundingClientRect()` per frame если RO не сработал |
| Lenis конфликтует с anchor-links / `scrollIntoView` | M | M | Перехват кликов по `a[href^="#"]` + `lenis.scrollTo` с offset для header |
| CLS из-за late-mount phone в `position: fixed` | L | M | Phone монтируется hidden (opacity 0), показывается после первого ScrollY-frame; layout не сдвигается |
| Word-stagger H1 рушит LCP | M | H | SSR initial state = финальный visual (opacity:1); animation только after mount → LCP не зависит от JS |
| Mobile-desktop branch divergence (mobile якорей нет) | L | M | `PhoneJourneyMount` проверяет media-query внутри useEffect и `return null` на mobile; root `PhoneJourney` тоже return null на mobile |
| Lenis ломает hydration | L | M | LenisProvider — client component, активируется в useEffect; SSR рендерит plain children |
| Bundle cap превышен | L | M | Если Lenis окажется >5KB после tree-shake — dynamic import только для desktop ветки |
| `framer-motion` `useScroll` deprecated в новой версии | L | L | Зафиксирована версия 12.39.0; миграция — отдельный спринт если понадобится |

## 11. Out-of-scope (на будущее)

- Page transitions (выбор был «без переходов»).
- 3D phone (r3f) — может появиться в v2 если CSS proxy окажется недостаточно «вау».
- View Transitions API — после Safari support и Next.js native integration.
- Параллакс на secondary pages (pricing, how-it-works) — пока нет такой необходимости.

---

**Next step:** запускаем `superpowers:writing-plans` skill для пошагового implementation plan, который будет жить в `docs/superpowers/plans/2026-05-21-site-animations-plan.md`.
