'use client';

import { useReducedMotion } from 'framer-motion';
import { useNearPageEnd } from '../model/hooks/useNearPageEnd';

/**
 * Decorative progressive-glass strip pinned to the bottom of the viewport.
 * The blur intensifies toward the very bottom (mask gradient) and fades out as
 * the user approaches the end of the page (so it never covers the footer/CTA).
 *
 * CSS (`.scroll-blur` in globals, outside @layer components) gates the
 * backdrop-filter behind `@supports` and disables the strip under
 * reduced-motion. Here we additionally skip all scroll work when reduced.
 */
export const ScrollBlur = () => {
  const shouldReduce = useReducedMotion();
  const visible = useNearPageEnd(!shouldReduce);

  if (shouldReduce) return null;

  return <div className="scroll-blur" data-visible={visible} aria-hidden="true" />;
};
