'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MOTION_DURATION } from '@/shared/ui/motion/constants';
import type { TPriceModeData } from '../types';

/** Format groups the big figure can be counted/displayed in. */
type TPriceFormat = 'money' | 'count';

/** Which format group a mode counts in. "vs coffee" is a plain count ("1"),
 *  everything else is money ("£X.XX"). */
const formatOf = (mode: TPriceModeData): TPriceFormat =>
  mode.id === 'coffee' ? 'count' : 'money';

/** Render a transient counter frame in the given format group. */
const formatValue = (value: number, format: TPriceFormat): string =>
  format === 'count' ? String(Math.round(value)) : `£${value.toFixed(2)}`;

type TUsePriceMorph = {
  /** Ref callback for the big-figure text node. Transient morph frames are
   *  written here directly (textContent), so React does not re-render per frame. */
  figureRef: (node: HTMLElement | null) => void;
  /** Static display string for SSR / first paint / the committed render. Equals
   *  the active mode's `amount`; transient frames overwrite the DOM on top. */
  display: string;
  /** Visually-hidden announcement string. Derived from `mode`, so the aria-live
   *  region announces once per mode change — never per animation frame. */
  announce: string;
};

/**
 * Drives the big-figure counter for the price toggle (I1).
 *
 * Every mode now carries a numeric `value`, so the figure always *counts*
 * to its target — there is no cross-fade anymore.
 *
 * Counting rules (agreed with product):
 *  - month £9.90 ↔ day £0.33 — same format group (money) → tween the real
 *    `prev → next` values, formatted "£X.XX".
 *  - any transition touching "vs coffee" (the `count` group) → the units differ
 *    (£ vs latte), so a `prev → next` tween would flash a bogus value like
 *    "£1.00". Instead we count `0 → next` and format with the *target* group:
 *    day→coffee counts 0→1 as a plain integer; coffee→day counts £0.00→£0.33.
 *  - `prefers-reduced-motion`: every change is instant (no tween).
 *
 * Frames are written straight to the DOM node via `figureRef` (no per-frame
 * React state) so the component does not re-render every animation frame.
 *
 * SSR-safe: the rendered text is the active mode's static `amount`, so the
 * server render and first client paint agree (no hydration mismatch). On a real
 * toggle, React re-renders with the new `amount` (committed text) and the
 * effect's rAF only overwrites the DOM node transiently on top of that value.
 */
export const usePriceMorph = (mode: TPriceModeData): TUsePriceMorph => {
  const shouldReduce = useReducedMotion();

  // The live text node we paint transient frames into.
  const nodeRef = useRef<HTMLElement | null>(null);
  const figureRef = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  // Track the previously-settled value *and* its format group so we know
  // whether the next transition can tween the real prev value or must reset to 0.
  const prevValueRef = useRef<number | undefined>(mode.value);
  const prevFormatRef = useRef<TPriceFormat>(formatOf(mode));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    const prevFormat = prevFormatRef.current;
    const nextValue = mode.value;
    const nextFormat = formatOf(mode);

    // Cancel any in-flight animation before (re)starting.
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const writeNode = (text: string) => {
      if (nodeRef.current) nodeRef.current.textContent = text;
    };

    const settle = () => {
      prevValueRef.current = nextValue;
      prevFormatRef.current = nextFormat;
    };

    // ── Reduced motion: instant swap, no tween. ──
    if (shouldReduce || nextValue === undefined) {
      writeNode(mode.amount);
      settle();
      return;
    }

    // Same format group → tween the real prev value. Different group (any coffee
    // transition) → start from 0 so we never flash a bogus "£1.00" / "1.00".
    const sameGroup = prevFormat === nextFormat && prevValue !== undefined;
    const from = sameGroup ? (prevValue as number) : 0;
    const to = nextValue;

    const durationMs = MOTION_DURATION.base * 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out, brand calm
      const current = from + (to - from) * eased;
      writeNode(formatValue(current, nextFormat));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        writeNode(mode.amount);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    settle();

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // mode.id is the discriminator that changes on a real toggle; amount/value
    // are derived from it, so keying on the full mode object is intentional.
  }, [mode, shouldReduce]);

  return {
    figureRef,
    display: mode.amount,
    announce: `${mode.amount} ${mode.unit}`.trim(),
  };
};
