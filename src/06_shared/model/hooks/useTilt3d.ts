'use client';
import { useCallback, useEffect, useRef } from 'react';
import {
  useMotionValue,
  useSpring,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion';

type TTilt3dOptions = {
  /** Maximum tilt angle in degrees. Default: 12 */
  max?: number;
  /** Spring config for the tilt motion. */
  spring?: SpringOptions;
};

type TTilt3dReturn = {
  /** Attach to the wrapper element to measure bounds and drive tilt. */
  ref: React.RefObject<HTMLElement | null>;
  /** Spread onto the `motion.div` that should visually tilt. */
  style: {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
  };
  /** Pointer-move handler — attach to the same wrapper element. */
  onPointerMove: (e: React.PointerEvent) => void;
  /** Pointer-leave handler — attach to the same wrapper element. */
  onPointerLeave: () => void;
};

const SPRING_DEFAULTS: SpringOptions = {
  stiffness: 200,
  damping: 30,
  mass: 0.6,
};

/**
 * Provides a 3-D tilt effect that follows the cursor over the target element.
 *
 * Usage:
 * ```tsx
 * const { ref, style, onPointerMove, onPointerLeave } = useTilt3d();
 * // wrapper receives the ref + handlers; inner motion.div receives style
 * <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
 *   <motion.div style={style}>{children}</motion.div>
 * </div>
 * ```
 *
 * Automatically disabled (returns zero values, no listeners) when:
 * - `prefers-reduced-motion: reduce` is active, OR
 * - the pointer is coarse (touch device).
 */
export function useTilt3d(options: TTilt3dOptions = {}): TTilt3dReturn {
  const max = options.max ?? 12;
  const spring = { ...SPRING_DEFAULTS, ...(options.spring ?? {}) };

  const ref = useRef<HTMLElement | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(rawX, spring);
  const rotateY = useSpring(rawY, spring);

  // Detect reduced-motion and coarse pointer. Both are read once on mount;
  // the window matchMedia listeners below keep them reactive.
  const reducedRef = useRef(false);
  const coarseRef = useRef(false);

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');

    reducedRef.current = mqReduced.matches;
    coarseRef.current = mqCoarse.matches;

    const onReduced = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
      if (e.matches) {
        rawX.set(0);
        rawY.set(0);
      }
    };
    const onCoarse = (e: MediaQueryListEvent) => {
      coarseRef.current = e.matches;
      if (e.matches) {
        rawX.set(0);
        rawY.set(0);
      }
    };

    mqReduced.addEventListener('change', onReduced);
    mqCoarse.addEventListener('change', onCoarse);
    return () => {
      mqReduced.removeEventListener('change', onReduced);
      mqCoarse.removeEventListener('change', onCoarse);
    };
  }, [rawX, rawY]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reducedRef.current || coarseRef.current) return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Normalize to [-1, 1]
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      rawY.set(nx * max * 2);
      rawX.set(-ny * max * 2);
    },
    [max, rawX, rawY],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return {
    ref,
    style: { rotateX, rotateY },
    onPointerMove,
    onPointerLeave,
  };
}
