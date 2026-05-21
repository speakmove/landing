'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export const HeroBgParallax = () => {
  const shouldReduce = useReducedMotion();
  const { scrollY } = useScroll();

  // y: grid drifts down (appears behind content), scale: zooms out as you scroll.
  // Both effects together make the parallax clearly visible.
  const y = useTransform(scrollY, [0, 800], [0, 160]);

  return (
    <motion.div
      aria-hidden="true"
      className="hero-bg-grid"
      style={shouldReduce ? undefined : { y }}
    />
  );
};
