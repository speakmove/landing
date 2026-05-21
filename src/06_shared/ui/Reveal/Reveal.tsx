'use client';

import { Children, isValidElement } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_EASE } from '../motion';

type TVariant = 'up' | 'left' | 'right' | 'scale' | 'fade-only';

type TProps = PropsWithChildren<{
  variant?: TVariant;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}>;

const INITIAL: Record<TVariant, Record<string, number>> = {
  up: { opacity: 0, y: 24 },
  left: { opacity: 0, x: -24 },
  right: { opacity: 0, x: 24 },
  scale: { opacity: 0, scale: 0.96 },
  'fade-only': { opacity: 0 },
};

const FINAL: Record<TVariant, Record<string, number>> = {
  up: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  'fade-only': { opacity: 1 },
};

export const Reveal = ({
  variant = 'up',
  delay = 0,
  stagger = 0,
  once = true,
  className,
  children,
}: TProps) => {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  if (stagger > 0) {
    const items = Children.toArray(children);
    return (
      <div className={className}>
        {items.map((child, i) => (
          <motion.div
            key={isValidElement(child) && child.key != null ? child.key : i}
            initial={INITIAL[variant]}
            whileInView={FINAL[variant]}
            viewport={{ once, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: MOTION_EASE.out,
            }}
          >
            {child as ReactNode}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={INITIAL[variant]}
      whileInView={FINAL[variant]}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: MOTION_EASE.out }}
    >
      {children}
    </motion.div>
  );
};
