'use client';

import { Children, isValidElement, useSyncExternalStore } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition, Transition } from 'framer-motion';
import { MOTION_EASE } from '@/shared/ui';

// ease-out-quint per animate-skill cheatsheet — refined, smooth deceleration
const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as const;

type TVariant = 'up' | 'rise' | 'cascade' | 'fade-only';

type TProps = PropsWithChildren<{
  variant?: TVariant;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}>;

// Initial hidden states per variant
const INITIAL: Record<TVariant, TargetAndTransition> = {
  up: { opacity: 0, y: 24 },
  'fade-only': { opacity: 0 },
  // opacity + lift + scale + blur — premium, soft
  rise: { opacity: 0, y: 32, scale: 0.96, filter: 'blur(8px)' },
  // per-child: opacity + lift + skew — spring-driven, staggered
  cascade: { opacity: 0, y: 24, skewY: 2 },
};

// Visible (in-view) target states per variant
const FINAL: Record<TVariant, TargetAndTransition> = {
  up: { opacity: 1, y: 0 },
  'fade-only': { opacity: 1 },
  rise: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  cascade: { opacity: 1, y: 0, skewY: 0 },
};

// Durations per variant (seconds)
const DURATION: Record<TVariant, number> = {
  up: 0.6,
  'fade-only': 0.6,
  rise: 0.7,
  cascade: 0.5,
};

// useSyncExternalStore is the SSR-safe way to detect client mount without
// triggering the react-hooks/set-state-in-effect lint rule.
const subscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

const makeTweenTransition = (variant: TVariant, delay: number): Transition =>
  variant === 'up'
    ? { duration: DURATION[variant], delay, ease: MOTION_EASE.out }
    : { duration: DURATION[variant], delay, ease: EASE_OUT_QUINT };

const makeSpringTransition = (delay: number): Transition => ({
  type: 'spring',
  stiffness: 320,
  damping: 28,
  delay,
});

export const Reveal = ({
  variant = 'up',
  delay = 0,
  stagger = 0,
  once = true,
  className,
  children,
}: TProps) => {
  const shouldReduce = useReducedMotion();
  const mounted = useIsMounted();

  if (shouldReduce || !mounted) {
    return <div className={className}>{children}</div>;
  }

  const initial = INITIAL[variant];
  const animate = FINAL[variant];
  const isCascade = variant === 'cascade';

  // Stagger path: each direct child gets its own motion wrapper
  if (stagger > 0) {
    const items = Children.toArray(children);
    return (
      <div className={className}>
        {items.map((child, i) => (
          <motion.div
            key={isValidElement(child) && child.key != null ? child.key : i}
            initial={initial}
            whileInView={animate}
            viewport={{ once, amount: 0.1 }}
            transition={
              isCascade
                ? makeSpringTransition(delay + i * stagger)
                : makeTweenTransition(variant, delay + i * stagger)
            }
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
      initial={initial}
      whileInView={animate}
      viewport={{ once, amount: 0.1 }}
      transition={
        isCascade ? makeSpringTransition(delay) : makeTweenTransition(variant, delay)
      }
    >
      {children}
    </motion.div>
  );
};
