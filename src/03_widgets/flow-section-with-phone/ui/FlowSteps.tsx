'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/shared/model/libs/cn';
import type { TStep } from '@/entities/step-card';

type TProps = {
  steps: TStep[];
  ariaLabel: string;
};

const VIEWPORT = { once: true, amount: 0.5 } as const;

/**
 * Vertical flow steps — each step reveals on scroll-into-view (rise + fade),
 * one-by-one as the user scrolls past it, like the home "Как тренируешься"
 * timeline nodes. The whole `<li>` is the motion element (not an inner
 * wrapper) so the absolutely-positioned connector line + number circle keep
 * their reference box. Reduced-motion → static, no animation.
 */
export const FlowSteps = ({ steps, ariaLabel }: TProps) => {
  const shouldReduce = useReducedMotion();

  return (
    <ol className="relative m-0 list-none p-0 pl-11" aria-label={ariaLabel}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        const motionProps = shouldReduce
          ? {}
          : {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: VIEWPORT,
              transition: {
                type: 'spring' as const,
                stiffness: 90,
                damping: 15,
              },
            };

        return (
          <motion.li
            key={step.num}
            className={cn('relative pt-1', isLast ? '' : 'pb-7')}
            {...motionProps}
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className="flow-step-line absolute -left-7 top-12 bottom-3 w-0.5"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="absolute -left-11 top-0 grid h-9 w-9 place-items-center rounded-full border-2 border-primary bg-white font-mono text-sm font-bold text-primary shadow-[0_0_0_4px_var(--color-primary-pale)]"
            >
              {idx + 1}
            </span>
            <h3 className="m-0 mb-1.5 text-lg font-bold tracking-[-0.01em] text-ink">
              {step.title}
            </h3>
            <p className="m-0 text-14-5 leading-[1.55] text-muted">
              {step.description}
            </p>
            {step.tag ? (
              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold',
                  step.tagStyle === 'gold'
                    ? 'bg-gold-pale text-gold-mid'
                    : 'bg-primary-pale text-primary-ink',
                )}
              >
                {step.tag}
              </span>
            ) : null}
          </motion.li>
        );
      })}
    </ol>
  );
};
