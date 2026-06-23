'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import {
  useReducedMotion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import type { TScenarioRowProps } from '../types';

/** Rows visible in the wheel window (matches `.scenarios-wheel-scroll` height). */
const VISIBLE_ROWS = 3;
/**
 * How many times the list is repeated to fake the infinite loop.
 * 5 copies give a larger buffer so reposition happens far from the active
 * scroll zone, reducing the chance of colliding with inertia/snap.
 */
const COPIES = 5;
/** Centre slot at scrollTop 0 is row 1 (first row of the middle copy). */
const CENTER_OFFSET = 1;

export type TUseScenariosWheelReturn = {
  containerRef: RefObject<HTMLDivElement | null>;
  /** True when the user prefers reduced motion — render flat list instead of wheel. */
  shouldReduce: boolean | null;
  scrollY: MotionValue<number>;
  rowHeight: MotionValue<number>;
  activeIndex: number;
  renderRows: TScenarioRowProps[];
  /** Pass to each ScenarioRow as `centerOffset`. */
  centerOffset: number;
};

/**
 * Orchestrates the iOS-wheel scroll picker for ScenariosWheel.
 *
 * Owns all state and side-effects:
 *  - containerRef + useScroll
 *  - rowHeight MotionValue + single ResizeObserver
 *  - activeIndex state + calcActiveIndex + scrollend/debounce settle-listener
 *  - renderRows (COPIES-copies memo)
 *
 * All hooks are called unconditionally. The `shouldReduce` flag is returned
 * so the UI can branch after calling the hook.
 */
export function useScenariosWheel(rows: TScenarioRowProps[]): TUseScenariosWheelReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  // ── Shared MotionValues (one per widget) ─────────────────────────────────
  // useScroll will receive containerRef once the wheel branch mounts.
  // In reduced-motion mode these are created but never wired to a container,
  // which is fine — they stay at their initial values and are never used.
  const { scrollY } = useScroll({ container: containerRef });
  const rowHeight = useMotionValue(104); // 104px fallback (6.5rem @ 16px root)

  // ── Single activeIndex state ──────────────────────────────────────────────
  // Formula: active row is centred when distance ≈ 0
  //   distance = loopIndex - CENTER_OFFSET - scrollY / rowHeight
  // ⟹ activeIndex = Math.round(CENTER_OFFSET + scrollY / rowHeight)
  const [activeIndex, setActiveIndex] = useState(CENTER_OFFSET);

  const calcActiveIndex = (sy: number, rh: number): number => {
    if (rh <= 0) return CENTER_OFFSET;
    return Math.round(CENTER_OFFSET + sy / rh);
  };

  // Live update so the green number tracks the centre row without lag.
  // `setActiveIndex` re-renders only when the rounded index changes, and
  // `ScenarioRow` is memoised → only the two affected rows re-render.
  // The settle effect below re-syncs after reposition.
  useMotionValueEvent(scrollY, 'change', (sy) => {
    if (shouldReduce) return;
    setActiveIndex(calcActiveIndex(sy, rowHeight.get()));
  });

  const renderRows = useMemo(
    () => Array.from({ length: COPIES }, () => rows).flat(),
    [rows],
  );

  useEffect(() => {
    if (shouldReduce) return;
    const el = containerRef.current;
    if (!el) return;

    const len = rows.length;
    if (len === 0) return;

    // ── Single ResizeObserver ─────────────────────────────────────────────
    const measure = () => {
      const h = el.clientHeight / VISIBLE_ROWS;
      if (h > 0) rowHeight.set(h);
    };

    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }

    // ── Initial scroll position ───────────────────────────────────────────
    // Start centred on the first row of copy 2 (index = len).
    // copy index 0: rows 0..(len-1)
    // copy index 1: rows len..(2*len-1)  ← starting point
    // scrollTop to centre row `len` (first of copy 2):
    //   row `len` is at scrollTop = (len - CENTER_OFFSET) * rowHeight
    //   = (len - 1) * rowHeight
    const listHeight = () => rowHeight.get() * len;
    el.scrollTop = listHeight() - rowHeight.get();

    // Set the correct initial active row (centred first row) — activeIndex is
    // otherwise only updated on settle.
    setActiveIndex(calcActiveIndex(el.scrollTop, rowHeight.get()));

    // ── Single settle-listener (reposition + reliable activeIndex) ────────
    // Reposition bookkeeping: We reposition ONLY after the scroll has come to
    // a full stop (scrollend or debounce fallback). This prevents the jump
    // from interrupting inertia or CSS snap momentum, which caused the
    // "focused row not locking" bug.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const onSettle = () => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }

      // Reposition to keep scrollTop inside the valid zone [lh, 3*lh].
      const lh = listHeight();
      if (lh > 0) {
        if (el.scrollTop < lh) {
          el.scrollTop += lh;
        } else if (el.scrollTop > lh * 3) {
          el.scrollTop -= lh;
        }
      }

      // Reliable final activeIndex recalculation (after inertia/reposition).
      const rh = rowHeight.get();
      setActiveIndex(calcActiveIndex(el.scrollTop, rh));
    };

    // Always attach a debounced `scroll` settle as the reliable path: on
    // touch/momentum `scrollend` is flaky and may never fire, which left the
    // wheel stuck at the end of the copies (last item couldn't be centred).
    // `scrollend` (when supported) is added on top purely for a snappier desktop feel.
    const onScrollDebounced = () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(onSettle, 90);
    };
    el.addEventListener('scroll', onScrollDebounced, { passive: true });

    const supportsScrollEnd = Boolean('onscrollend' in el);
    if (supportsScrollEnd) {
      el.addEventListener('scrollend', onSettle, { passive: true });
    }

    return () => {
      ro?.disconnect();
      el.removeEventListener('scroll', onScrollDebounced);
      if (supportsScrollEnd) el.removeEventListener('scrollend', onSettle);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
    };
  }, [shouldReduce, rows.length, rowHeight]);

  return {
    containerRef,
    shouldReduce,
    scrollY,
    rowHeight,
    activeIndex,
    renderRows,
    centerOffset: CENTER_OFFSET,
  };
}
