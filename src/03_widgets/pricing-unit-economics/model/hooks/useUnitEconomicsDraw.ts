'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/** Total draw duration (s) — one rAF cycle drives ring + counter + legend. */
const DRAW_DURATION = 3;

type TUseUnitEconomicsDraw = {
  /** Attach to the ring element — `--ue-reveal` (0→360deg) is written here. */
  donutRef: (node: HTMLElement | null) => void;
  /** Attach to the centre figure — transient `£X.XX` frames are written here. */
  figureRef: (node: HTMLElement | null) => void;
  /** Attach to the section wrapper — in-view triggers the one-shot animation. */
  sectionRef: (node: HTMLElement | null) => void;
  /**
   * How many legend rows are currently lit. State only changes when the
   * counter crosses a row threshold (~7 times total) — never per frame.
   */
  visibleCount: number;
};

/**
 * Drives the UnitEconomics draw-in (one rAF cycle, ease-out, ~1.6s):
 *  1. ring sweeps clockwise — `--ue-reveal` 0deg → 360deg;
 *  2. centre figure counts `£(total·p)` → `£total`;
 *  3. legend rows light up as the count crosses each cumulative threshold.
 *
 * Ring angle and counter text are written straight to the DOM each frame
 * (no per-frame React state). `visibleCount` is the ONLY state and it bumps
 * only when a threshold is crossed (≈7 commits for the whole run).
 *
 * Triggered once when the section scrolls into view. With reduced motion the
 * ring is full, the figure shows the final total, and every row is lit — no rAF.
 */
export const useUnitEconomicsDraw = (
  total: number,
  thresholds: readonly number[],
): TUseUnitEconomicsDraw => {
  const shouldReduce = useReducedMotion();

  const donutNodeRef = useRef<HTMLElement | null>(null);
  const figureNodeRef = useRef<HTMLElement | null>(null);
  const sectionNodeRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const inView = useInView(sectionNodeRef, { once: true, amount: 0.4 });

  const rowCount = thresholds.length;
  const [visibleCount, setVisibleCount] = useState(
    shouldReduce ? rowCount : 0,
  );

  // Stable ref-setter identities so memoised children don't see new props
  // each render and React doesn't detach/reattach the refs every render.
  const donutRef = useCallback((node: HTMLElement | null) => {
    donutNodeRef.current = node;
  }, []);
  const figureRef = useCallback((node: HTMLElement | null) => {
    figureNodeRef.current = node;
  }, []);
  const sectionRef = useCallback((node: HTMLElement | null) => {
    sectionNodeRef.current = node;
  }, []);

  useEffect(() => {
    const writeAngle = (deg: number) => {
      donutNodeRef.current?.style.setProperty('--ue-reveal', `${deg}deg`);
    };
    const writeFigure = (value: number) => {
      if (figureNodeRef.current) {
        figureNodeRef.current.textContent = value.toFixed(2);
      }
    };

    // ── Reduced motion: settle everything instantly, no animation. ──
    // The DOM (ring angle + figure) is written immediately; the row-count
    // commit is deferred to a rAF so it isn't a direct setState in the effect.
    if (shouldReduce) {
      writeAngle(360);
      writeFigure(total);
      rafRef.current = requestAnimationFrame(() => {
        setVisibleCount(rowCount);
        rafRef.current = null;
      });
      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }

    // Hide the ring (angle 0) until the draw starts, so it doesn't flash full
    // (the @property initial 360deg is the no-JS fallback) then snap to 0.
    if (!startedRef.current) writeAngle(0);

    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const durationMs = DRAW_DURATION * 1000;
    const start =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    // How many thresholds the current counter value has crossed.
    const litFor = (value: number): number => {
      let count = 0;
      for (const threshold of thresholds) {
        if (value + 1e-6 >= threshold) count += 1;
        else break;
      }
      return count;
    };

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const p = 1 - Math.pow(1 - t, 3); // ease-out, brand calm
      const value = total * p;

      writeAngle(360 * p);
      writeFigure(value);

      // Commit state only when the lit-row count actually changes.
      const lit = litFor(value);
      setVisibleCount((prev) => (lit > prev ? lit : prev));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        writeAngle(360);
        writeFigure(total);
        setVisibleCount(rowCount);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [inView, shouldReduce, total, rowCount, thresholds]);

  return { donutRef, figureRef, sectionRef, visibleCount };
};
