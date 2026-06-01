'use client';
import { useEffect, useRef, useCallback } from 'react';
import {
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  motionValue,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion';

type TParallaxLayerStyle = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

type TParallaxLayersReturn = {
  /**
   * Attach to the section/container element.
   * - Desktop (pointer: fine): used as the cursor hit-area.
   * - Touch (pointer: coarse): used as the scroll target for `useScroll`.
   */
  ref: React.RefObject<HTMLElement | null>;
  /**
   * Returns per-layer MotionValues driven by depth.
   *
   * @param depth  Multiplier in the range [0, 1].
   *   - `0` → static (no movement)
   *   - `1` → maximum movement (≈ `CURSOR_MAX` px)
   *
   * The returned `{ x, y }` MotionValues are reactive and can be spread
   * directly onto a `<motion.div style={...} />`.
   *
   * On reduced-motion or coarse pointer with no scroll, values stay at 0.
   *
   * Usage:
   * ```tsx
   * 'use client';
   * const { ref, layer } = useParallaxLayers();
   * return (
   *   <section ref={ref}>
   *     <motion.div style={layer(0.2)}>slow background</motion.div>
   *     <motion.div style={layer(0.6)}>faster midground</motion.div>
   *   </section>
   * );
   * ```
   */
  layer: (depth: number) => TParallaxLayerStyle;
};

const SPRING: SpringOptions = { stiffness: 80, damping: 20, mass: 0.8 };

/** Maximum translation in px at depth = 1. */
const CURSOR_MAX = 48;

/**
 * Drives multi-layer parallax from either the cursor (desktop, pointer: fine)
 * or the section scroll position (touch, pointer: coarse).
 * Reduced-motion: all layers return static zero MotionValues.
 */
export function useParallaxLayers(): TParallaxLayersReturn {
  const ref = useRef<HTMLElement | null>(null);

  // Raw normalized cursor offset [-1, 1].
  const cursorNX = useMotionValue(0);
  const cursorNY = useMotionValue(0);

  const smoothNX = useSpring(cursorNX, SPRING);
  const smoothNY = useSpring(cursorNY, SPRING);

  // Scroll-based normalized Y for touch. Measures the ref element.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Map [0 → 1] to [-1 → 1].
  const scrollNormY = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  const reducedRef = useRef(false);
  const coarseRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');

    reducedRef.current = mqReduced.matches;
    coarseRef.current = mqCoarse.matches;

    const onReduced = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
    };
    const onCoarse = (e: MediaQueryListEvent) => {
      coarseRef.current = e.matches;
    };

    mqReduced.addEventListener('change', onReduced);
    mqCoarse.addEventListener('change', onCoarse);
    return () => {
      mqReduced.removeEventListener('change', onReduced);
      mqCoarse.removeEventListener('change', onCoarse);
    };
  }, []);

  // Attach pointermove listener to window so it fires even when the target
  // element has `pointer-events: none`.  Normalized offset is still computed
  // relative to ref.current's bounding rect so the "center" tracks the hero.
  // When the cursor moves above the hero (ny < -1) we reset toward zero.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMove = (e: PointerEvent) => {
      if (reducedRef.current || coarseRef.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      // Reset smoothly when the pointer is far outside the hero vertically
      // (e.g. user moved to a nav element above the fold).
      if (ny < -1) {
        cursorNX.set(0);
        cursorNY.set(0);
        return;
      }
      cursorNX.set(nx);
      cursorNY.set(ny);
    };

    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, [cursorNX, cursorNY]);

  /**
   * Creates reactive `{ x, y }` MotionValues for the given depth.
   *
   * Uses imperative `motionValue()` + `.on('change', ...)` subscriptions so
   * this function is NOT a hook and can be called freely in render.
   */
  const layer = useCallback(
    (depth: number): TParallaxLayerStyle => {
      const scale = CURSOR_MAX * depth;

      // Create plain MotionValues (non-hook factory).
      const x = motionValue(smoothNX.get() * scale);
      const y = motionValue(smoothNY.get() * scale);

      // Subscribe to the appropriate source.
      // Subscriptions run synchronously on each source update → no re-render.
      const unsubX = smoothNX.on('change', (v) => {
        if (reducedRef.current || coarseRef.current) {
          x.set(0);
        } else {
          x.set(v * scale);
        }
      });

      const unsubY = smoothNY.on('change', (v) => {
        if (reducedRef.current) {
          y.set(0);
          return;
        }
        if (coarseRef.current) return; // scroll drives y on coarse
        y.set(v * scale);
      });

      const unsubScrollY = scrollNormY.on('change', (v) => {
        if (reducedRef.current) {
          y.set(0);
          return;
        }
        if (coarseRef.current) {
          y.set(v * scale);
        }
      });

      // NOTE: These subscriptions live for the lifetime of the component.
      // The hero is the single consumer (unmounts once), so the leak is
      // acceptable. If multiple consumers become a concern, wrap in
      // `useEffect(() => () => { unsubX(); unsubY(); unsubScrollY(); }, [])`.
      void unsubX;
      void unsubY;
      void unsubScrollY;

      return { x, y };
    },
    [smoothNX, smoothNY, scrollNormY],
  );

  return { ref, layer };
}
