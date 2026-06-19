'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import type { TStep } from '@/entities/step-card';

type TTimelineVariant = 'horizontal' | 'vertical';

type TProps = {
  step: TStep;
  isAccent: boolean;
  variant: TTimelineVariant;
  /** Position in the list — drives a small cascade delay. */
  index: number;
};

/** Layout-only differences between the horizontal (desktop) and vertical (mobile) node. */
const LAYOUT: Record<
  TTimelineVariant,
  { li: string; circle: string; heading: string; badge: string }
> = {
  horizontal: {
    li: 'flex flex-col items-center text-center',
    circle: 'relative z-10',
    heading: 'mt-4',
    badge: 'self-center',
  },
  vertical: {
    li: 'relative flex flex-col',
    circle: 'absolute -left-12 top-0',
    heading: '',
    badge: 'self-start',
  },
};

/** Trigger each node's reveal once it's well into the viewport. */
const VIEWPORT = { once: true, amount: 0.6 } as const;

/**
 * Shared timeline node: numbered circle + title + description + optional tag.
 * Reveals itself on scroll-into-view with a slow, springy pop; each node fires
 * individually so they appear as the user scrolls to them. Reduced-motion → static.
 */
export function TimelineNode({ step, isAccent, variant, index }: TProps) {
  const layout = LAYOUT[variant];
  const shouldReduce = useReducedMotion();

  const motionProps = shouldReduce
    ? {}
    : {
        initial: { opacity: 0, y: 40, scale: 0.85 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: VIEWPORT,
        transition: {
          type: 'spring' as const,
          stiffness: 90,
          damping: 14,
          delay: index * 0.12,
        },
      };

  return (
    <motion.li className={layout.li} {...motionProps}>
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          layout.circle,
          isAccent
            ? 'bg-primary shadow-(--shadow-mid)'
            : 'border border-line bg-white shadow-(--shadow-soft)',
        )}
      >
        <span
          className={cn(
            'font-mono text-xs font-bold tracking-widest',
            isAccent ? 'text-white' : 'text-primary',
          )}
        >
          {step.num}
        </span>
      </div>

      <h3
        className={cn(
          'mb-1.5 text-17 font-bold leading-snug',
          layout.heading,
          isAccent ? 'text-primary-ink' : 'text-ink',
        )}
      >
        {step.title}
      </h3>
      <p className="m-0 text-sm leading-relaxed text-muted">{step.description}</p>
      {step.tag ? (
        <Badge tone="neutral" className={cn('mt-3', layout.badge)}>
          {step.tag}
        </Badge>
      ) : null}
    </motion.li>
  );
}
