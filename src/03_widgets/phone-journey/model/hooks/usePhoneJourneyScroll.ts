'use client';

import { useEffect, useState } from 'react';
import { usePhoneJourneyContext } from '../store';

type TJourneyState = {
  x: number;
  y: number;
  scale: number;
  rotateY: number;
  visible: boolean;
};

const SOURCE_SCALE = 1;
const TARGET_SCALE = 0.8;
const SOURCE_ROTATE_Y = 0;
const TARGET_ROTATE_Y = -6;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const usePhoneJourneyScroll = (): TJourneyState => {
  const { registryRef, registryVersion } = usePhoneJourneyContext();
  const [state, setState] = useState<TJourneyState>({
    x: 0,
    y: 0,
    scale: SOURCE_SCALE,
    rotateY: SOURCE_ROTATE_Y,
    visible: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const compute = () => {
      const sourceEl = registryRef.current.source?.current;
      const targetEl = registryRef.current.target?.current;
      if (!sourceEl) {
        setState((s) => ({ ...s, visible: false }));
        return;
      }
      const vh = window.innerHeight;
      const sRect = sourceEl.getBoundingClientRect();
      const tRect = targetEl?.getBoundingClientRect();

      const sourceInView = sRect.bottom > 0 && sRect.top < vh;
      const targetInView = tRect ? tRect.bottom > 0 && tRect.top < vh : false;
      const visible = sourceInView || targetInView;

      if (!tRect) {
        setState({
          x: sRect.left + sRect.width / 2,
          y: sRect.top + sRect.height / 2,
          scale: SOURCE_SCALE,
          rotateY: SOURCE_ROTATE_Y,
          visible,
        });
        return;
      }

      // Journey progresses as the target slot scrolls from below the viewport to its resting spot.
      // Interpolation t: 0 when target's top is at viewport bottom, 1 when target's top is at viewport top.
      const denom = vh;
      const t = clamp01(1 - tRect.top / denom);

      const sx = sRect.left + sRect.width / 2;
      const sy = sRect.top + sRect.height / 2;
      const tx = tRect.left + tRect.width / 2;
      const ty = tRect.top + tRect.height / 2;

      setState({
        x: lerp(sx, tx, t),
        y: lerp(sy, ty, t),
        scale: lerp(SOURCE_SCALE, TARGET_SCALE, t),
        rotateY: lerp(SOURCE_ROTATE_Y, TARGET_ROTATE_Y, t),
        visible,
      });
    };

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [registryRef, registryVersion]);

  return state;
};
