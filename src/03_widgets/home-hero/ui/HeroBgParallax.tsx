'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Hero background layer — decorative only, aria-hidden.
 *
 * Renders a faint CSS grid (`.hero-bg-grid`, emphasized toward the bottom) plus
 * a static ambient emerald blob. The grid drifts vertically on SCROLL (not the
 * cursor): as the hero scrolls out of view, the grid shifts down slightly,
 * giving a calm depth parallax.
 *
 * Reduced-motion → grid is fully static (no scroll transform).
 */
export const HeroBgParallax = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll progress of the hero through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  // Grid drifts down a touch as the hero scrolls away (0 → 60px).
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div ref={ref} aria-hidden="true" className="hero-parallax-root">
      <motion.div
        className="hero-bg-grid"
        style={reduce ? undefined : { y: gridY }}
      />
      <div className="hero-ambient-blob" />
    </div>
  );
};
