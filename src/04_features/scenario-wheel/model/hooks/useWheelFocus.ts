'use client';

import { useTransform, type MotionValue } from 'framer-motion';

type TWheelFocusOptions = {
  /** Shared scrollY MotionValue from the container (created once in ScenariosWheel). */
  scrollY: MotionValue<number>;
  /** Shared rowHeight MotionValue (px) measured once in ScenariosWheel. */
  rowHeight: MotionValue<number>;
  /** Zero-based index of this row within the rendered list. */
  index: number;
  /**
   * Index of the centre slot at scrollTop === 0, in rows.
   * Infinite loop → 1 (row 1 centred at top of a 3-row window).
   */
  centerOffset: number;
};

type TWheelFocusReturn = {
  /** Row scale: 1.0 at centre, easing to 0.8 two rows away. */
  scale: MotionValue<number>;
  /** Row opacity: 1.0 at centre, easing to 0.3 two rows away. */
  opacity: MotionValue<number>;
  /**
   * Row rotateX (iOS-wheel cylinder tilt): 0° at centre, ±60° two rows away.
   * Requires `transform-style: preserve-3d` on the row (.scenarios-wheel-row)
   * and `perspective` on the wrapper (.scenarios-wheel-outer).
   */
  rotateX: MotionValue<number>;
};

/**
 * Pure deriver hook: computes per-row wheel-focus transforms from shared
 * MotionValues passed down from ScenariosWheel.
 *
 * Contains ZERO side effects — no useScroll, no ResizeObserver, no
 * scroll listeners, no useState, no useEffect, no useMotionValueEvent.
 * All transforms are cheap `useTransform` subscriptions that piggy-back on
 * the single scrollY/rowHeight updates in the parent.
 *
 * The wheel geometry formula:
 *   distance = index - centerOffset - scrollY / rowHeight
 * All visual transforms map from that signed distance (in rows).
 */
export function useWheelFocus({
  scrollY,
  rowHeight,
  index,
  centerOffset,
}: TWheelFocusOptions): TWheelFocusReturn {
  // Signed distance from centre slot, in rows.
  // Multi-input useTransform; noUncheckedIndexedAccess → guard with defaults.
  const distance = useTransform<number, number>(
    [scrollY, rowHeight],
    ([s = 0, h = 0]) => (h ? index - centerOffset - s / h : 0),
  );

  const scale = useTransform(distance, [-2, -1, 0, 1, 2], [0.8, 0.92, 1, 0.92, 0.8]);
  const opacity = useTransform(distance, [-2, -1, 0, 1, 2], [0.3, 0.6, 1, 0.6, 0.3]);
  const rotateX = useTransform(distance, [-2, -1, 0, 1, 2], [60, 32, 0, -32, -60]);

  return { scale, opacity, rotateX };
}
