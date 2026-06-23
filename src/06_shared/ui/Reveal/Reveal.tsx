'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

import {
  DUR_REVEAL,
  MOTION_EASE,
  REVEAL,
  STAGGER_CHILDREN,
} from '@/shared/ui/motion/constants';

type TEase = readonly [number, number, number, number];

const EASE: TEase = MOTION_EASE.out;

// ─── Reveal ──────────────────────────────────────────────────────────────────

type TRevealProps = PropsWithChildren<{
  variant?: 'rise' | 'scaleUp';
  stagger?: boolean;
  className?: string;
}>;

const STAGGER_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
    },
  },
} as const;

export function Reveal({
  children,
  variant = 'rise',
  stagger = false,
  className,
}: TRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (stagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={STAGGER_VARIANTS}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={REVEAL[variant]}
      transition={{ duration: DUR_REVEAL, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── RevealItem ───────────────────────────────────────────────────────────────

type TRevealItemProps = PropsWithChildren<{
  variant?: 'rise' | 'scaleUp';
  className?: string;
}>;

export function RevealItem({
  children,
  variant = 'rise',
  className,
}: TRevealItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={REVEAL[variant]}
      transition={{ duration: DUR_REVEAL, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
