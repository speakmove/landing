# Session Handoff — 2026-05-21

## How to continue in a new chat

Open a new Claude Code session in this repo and say:

> Прочитай docs/SESSION_HANDOFF.md и продолжи с L2 (Sticky phone + 8 scenarios). Я подтвержу каждую анимацию перед следующей — мы работаем по схеме L1 → ack → L2 → ack → …

The auto-memory under `~/.claude/projects/.../memory/` will load automatically and give the new session full architectural context.

---

## What was done in the previous session

### Refactors (G–I) — all completed

- **G — `forwardRef` → `ref` as prop.** `ActiveLink` rewritten using React 19 ref-as-prop pattern (project is on React 19.2). No `forwardRef` anywhere now.
- **H — JSON-LD builders centralised.** All builders moved from `src/06_shared/ui/JsonLd/` to `src/06_shared/model/libs/jsonld/builders.ts`. The file now exports `buildOrganizationLd`, `buildSoftwareApplicationLd`, `buildFaqLd`, `buildBreadcrumbLd`, `buildHowToLd`, `buildSpeakableLd`. Inline JSON-LD objects in `layout.tsx`, `FaqSection`, `PricingHero` replaced by builder calls.
- **I — `env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')` eliminated.** Trailing-slash strip moved into the zod schema via `.transform()`. Every `.replace()` call removed.

### Docs (J)

- `~/Desktop/speakmove_v0_plan.md` updated with two new sections:
  - **§6.3 AI Visibility Monitoring (V0)** — Otterly AI / Peec AI / DIY monthly query check
  - **§6.4 Outreach Roadmap (V1+)** — Wikipedia, Reddit, Trustpilot, guest posts, YouTube. Each entry has "why" + "when" + "what".

### Legal audit (K) — all completed

- Privacy Policy: added `eligibility` (18+) and `biometric` (voice notice under GDPR Art. 4(14)) sections to ru/uk/en.
- Terms of Use: added `eligibility` (18+) section to ru/uk/en.
- **New `/disclaimer` page** in ru/uk/en — full copy in i18n + route `app/[locale]/disclaimer/page.tsx` + page component `src/02_pages/disclaimer/` + footer link in all three locales + sitemap entry.
- Internal docs: `docs/legal/ropa.md` (Record of Processing Activities, GDPR Art. 30) and `docs/legal/dpia.md` (Data Protection Impact Assessment for voice biometric, Art. 35).

### Animation infrastructure (L)

- `framer-motion@^12.39.0` installed.
- `src/06_shared/ui/motion/constants.ts` — durations + ease presets.
- Voice-pulse CSS in `globals.css` — subtle `.tg-play-me` / `.tg-play-bot` scale pulse, desynced via `nth-of-type` delays, disabled under `prefers-reduced-motion`.

### L1 — Hero: phone breathes & plays (completed, user approved)

Files added/changed:
- `src/03_widgets/home-hero/ui/BreathingPhone.tsx` — client component wrapping the phone preview with **aperiodic** idle motion. Each axis runs on its own coprime period (25 / 31 / 37 / 41s) and an asymmetric keyframe path, so the phone drifts like a buoy rather than swinging like a pendulum. **Final tuning per user feedback:** much slower (~2.2× the initial speed) after two rounds of "медленнее".
- `src/03_widgets/home-hero/ui/RotatingStatus.tsx` — client component cycling the chat header status pill ("Записывает аудио… → Обрабатывает… → Отвечает") with `AnimatePresence` cross-fade every 3s.
- `src/03_widgets/home-hero/ui/HomePhonePreview.tsx` — now wraps `PhoneMockup` in `BreathingPhone` and passes `<RotatingStatus statuses={…} />` as `botStatus`.
- `src/05_entities/phone-mockup/ui/ChatHeader.tsx` + `PhoneMockup.tsx` — `botStatus` prop type widened from `string` to `ReactNode` so client components can be injected.
- Copy: `botStatuses` array added in ru/uk/en under `HomePage.hero.phonePreview`.

`prefers-reduced-motion` respected everywhere via `useReducedMotion()` and CSS `@media`.

---

## What remains — animations to implement one-by-one with user approval

Order: **L2 → L3 → L4 → L5 → L6**. Implement one, show user, wait for ack, then next.

### L2 — Sticky phone + 8 scenarios (desktop only)

Section: `HomeScenariosGrid` in `src/03_widgets/home-scenarios-grid/`.

Pattern (Linear / Stripe style):
- On `lg+` (≥1024px): phone pinned on the left of the section, scenario cards scroll on the right.
- Phone screen morphs (chat content fade-out / fade-in) as each scenario crosses the viewport center.
- Use Framer Motion `useScroll` + `useTransform` against the section element.
- On `< lg`: regular grid as today + simple `whileInView` fade-up on each card.

Hint: the cards data lives at `HomePage.scenariosGrid.cards` (8 entries: landlord, gp, interview, smalltalk, official, school, workcoach, pharmacy). Map each to a different chat preview inside the pinned phone.

### L3 — Mobile menu slide-from-right + stagger

Component: `src/03_widgets/site-header/ui/HeaderMobileMenu.tsx`.

Replace the hard show/hide with:
- Backdrop `motion.div` fade 0 → 1.
- Panel slides from the right (`x: 100% → 0`) over 240ms `ease-out`.
- Nav items stagger-fade with 30ms delay each (`AnimatePresence` + `motion.li` variants).
- Mind the `Portal` + focus trap that's already there — don't break a11y.

### L4 — Voice ripple on primary CTA

Wrap primary CTAs ("Попробовать бесплатно" / "Начать бесплатно") in a `VoiceRipple` component:
- On hover, two-three concentric translucent rings expand outward and fade out, like sonar pings.
- CSS-only is fine (no JS needed), or Framer Motion if cleaner.
- Disabled on touch devices (no `:hover`) — verify with `@media (hover: hover)`.

### L5 — Hero parallax `.hero-bg-grid`

`HomeHero.tsx` has `<div aria-hidden="true" className="hero-bg-grid" />` at the top.

- Tie `y` translation of this element to scroll progress via Framer Motion `useScroll` + `useTransform`.
- Speed: 30% of scroll velocity (i.e. when user scrolls 100px, bg moves 30px down — creates depth).
- Must not break on mobile — disable below `md` or keep tiny.

### L6 — Advantage-tile icon pulse on enter

Component: `src/05_entities/advantage-tile/ui/AdvantageTile.tsx`.

- When tile enters the viewport, icon does `scale 1 → 1.1 → 1` over 300ms once.
- Implement via Framer Motion `whileInView` + `viewport={{ once: true }}`.

---

## Decisions locked in (do not re-litigate)

- **Vibe**: calm & voice-first. Not Awwwards-tech-showcase, not playful.
- **Library**: framer-motion only. No GSAP, no Lenis, no Three.js.
- **Sticky-scroll on mobile**: no — desktop-only.
- **Page transitions**: no.
- **Other micro-fx**: not adding accordion / magnetic cursor / price counter. Only the 6 effects above.
- **`prefers-reduced-motion`**: every animation must check and disable.

---

## Architectural notes the new session should respect

- FSD layers — feature-sliced-design skill is the guide. New animation files live under the widget that owns them (`src/03_widgets/home-hero/ui/`), not in `shared/ui/`. Generic primitives (durations, easings) belong in `shared/ui/motion/`.
- No arbitrary Tailwind values (`text-[14px]`, `bg-[#abc]`). Use the @theme tokens already defined in `globals.css`.
- No inline styles in JSX — use `className` + Tailwind. Exception: the BreathingPhone's `transformPerspective` and `transformStyle` need raw style because Tailwind has no utilities for them. That's acceptable per FSD's "boundary" exception.
- Hooks under `model/hooks/useFoo.ts`, camelCase. Slices never import siblings — only via shared.
- Public copy never names AI vendors (no "OpenAI", "Whisper", "GPT") — use functional terms.

---

## How to verify current state

```bash
# Working tree should compile clean
npx tsc --noEmit

# L1 visible in browser
npm run dev
# Open http://localhost:3000 — hero phone should drift slowly in 3D,
# voice-bubble play buttons pulse with staggered delays,
# header pill cycles "Записывает / Обрабатывает / Отвечает" every 3s.
```

If `npx tsc` shows errors, something drifted. Last green commit/state: end of L1 (this handoff was written at that point).
