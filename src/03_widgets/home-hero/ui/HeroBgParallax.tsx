'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Hero background layer — decorative only, aria-hidden.
 *
 * Static base = soft radial gradients + ambient emerald blob (`.hero-bg-grid`).
 * On top, a separate grid-lines layer (`.hero-grid-lines`, emphasized toward the
 * bottom) drifts vertically on SCROLL for a clearly visible depth parallax: as
 * the hero scrolls away the grid slides down ~140px relative to the page.
 *
 * Reduced-motion → grid is fully static.
 */
export const HeroBgParallax = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <div ref={ref} aria-hidden="true" className="hero-parallax-root">
      <div className="hero-bg-grid" />
      <motion.div
        className="hero-grid-lines"
        style={reduce ? undefined : { y: gridY }}
      />
      <div className="hero-ambient-blob" />
    </div>
  );
};
