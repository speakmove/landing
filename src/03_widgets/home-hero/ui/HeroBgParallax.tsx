'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export const HeroBgParallax = () => {
  const shouldReduce = useReducedMotion();
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 800], [0, 320]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.4]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.15]);

  return (
    <motion.div
      aria-hidden="true"
      className="hero-bg-grid"
      style={shouldReduce ? undefined : { y, opacity, scale }}
    />
  );
};
