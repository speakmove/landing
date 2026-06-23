/**
 * Shared motion constants — keep durations and easings consistent across
 * all framer-motion animations. The brand vibe is calm and voice-first,
 * so defaults lean toward slow, gentle, ease-out curves.
 */

export const MOTION_DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  idle: 6, // idle loops (breathing, tilt)
  status: 3, // status pill rotation
} as const;

/** cubic-bezier easing presets — same set as Tailwind theme. */
export const MOTION_EASE = {
  out: [0.22, 1, 0.36, 1] as const, // smooth deceleration
  inOut: [0.65, 0, 0.35, 1] as const, // S-curve, calm
  spring: [0.34, 1.56, 0.64, 1] as const, // light bounce
} as const;

/** Reveal duration (seconds) — used by the Reveal component and scroll-triggered widgets. */
export const DUR_REVEAL = 0.7;

/** Stagger delay between children in a staggered reveal container. */
export const STAGGER_CHILDREN = 0.08;

/**
 * Framer-motion variants for scroll/mount reveal animations.
 * Pass to `variants` on a `motion.*` element; drive with `initial="hidden"` + `animate/whileInView="show"`.
 *
 * Eases reuse MOTION_EASE values — no duplication.
 */
export const REVEAL = {
  rise: {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  },
} as const;
