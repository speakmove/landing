'use client';

import type { CSSProperties } from 'react';
import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SplitTextReveal } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  before: string;
  accent: string;
  after: string;
  className?: string;
};

// useSyncExternalStore is the SSR-safe way to detect client mount without
// triggering the react-hooks/set-state-in-effect lint rule.
const subscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

// Total letter count used to time the accent underline draw after all letters appear.
const countLetters = (text: string) => text.replace(/\s/g, '').length;

export const HeroTitle = ({ before, accent, after, className }: TProps) => {
  const mounted = useIsMounted();
  const shouldReduce = useReducedMotion();
  const isAnimated = mounted && !shouldReduce;

  const fullText = `${before}${accent}${after}`;

  // Approximate delay: all letters stagger at ~0.03s each, duration 0.7s.
  // Underline draws after the last letter finishes.
  const totalLetters = countLetters(before) + countLetters(accent) + countLetters(after);
  const underlineDelay = totalLetters * 0.03 + 0.5;

  // --accent-delay is set as a CSS custom property; the keyframe in globals.css
  // reads it via var(--accent-delay) for animation-delay. This is the only
  // accepted JS→CSS bridge for a value the keyframe cannot compute itself.
  const accentStyle: CSSProperties = { ['--accent-delay' as string]: `${underlineDelay}s` };

  return (
    <h1
      className={cn(
        'h-display-hero mt-4 mb-5 font-extrabold leading-[1.03] tracking-[-0.025em] text-ink',
        className,
      )}
      aria-label={fullText}
    >
      <span aria-hidden="true">
        <SplitTextReveal
          segments={[
            { text: before },
            { text: accent, accent: true },
            { text: after },
          ]}
          accentClassName={cn('accent-underline', isAnimated && 'is-drawn')}
          accentStyle={accentStyle}
        />
      </span>
    </h1>
  );
};
