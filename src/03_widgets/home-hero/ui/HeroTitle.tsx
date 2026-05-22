'use client';

import type { CSSProperties } from 'react';
import { useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_EASE } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  before: string;
  accent: string;
  after: string;
  className?: string;
};

const WORD_DELAY = 0.06;

const splitWords = (text: string): string[] =>
  text.split(/(\s+)/).filter((chunk) => chunk.length > 0);

const countWords = (chunks: string[]): number =>
  chunks.filter((chunk) => chunk.trim().length > 0).length;

// useSyncExternalStore is the SSR-safe way to detect client mount without
// triggering the react-hooks/set-state-in-effect lint rule.
const subscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

type TWordsProps = {
  words: string[];
  startWordIndex: number;
  animate: boolean;
};

const Words = ({ words, startWordIndex, animate }: TWordsProps) => {
  let wordOffset = 0;
  return words.map((chunk, i) => {
    if (chunk.trim().length === 0) return <span key={`s-${startWordIndex}-${i}`}>{chunk}</span>;
    const wordIndex = startWordIndex + wordOffset;
    wordOffset += 1;
    return (
      <motion.span
        key={`w-${wordIndex}`}
        className="inline-block"
        initial={animate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: 0.5,
          delay: wordIndex * WORD_DELAY,
          ease: MOTION_EASE.out,
        }}
      >
        {chunk}
      </motion.span>
    );
  });
};

export const HeroTitle = ({ before, accent, after, className }: TProps) => {
  const mounted = useIsMounted();
  const shouldReduce = useReducedMotion();
  const animate = mounted && !shouldReduce;

  const beforeWords = splitWords(before);
  const accentWords = splitWords(accent);
  const afterWords = splitWords(after);
  const beforeWordCount = countWords(beforeWords);
  const accentWordCount = countWords(accentWords);
  const totalWordCount = beforeWordCount + accentWordCount + countWords(afterWords);
  const underlineDelay = totalWordCount * WORD_DELAY + 0.2;

  const fullText = `${before}${accent}${after}`;

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
        <Words words={beforeWords} startWordIndex={0} animate={animate} />
        <span
          className={cn('accent-underline', animate && 'is-drawn')}
          style={accentStyle}
        >
          <Words words={accentWords} startWordIndex={beforeWordCount} animate={animate} />
        </span>
        <Words
          words={afterWords}
          startWordIndex={beforeWordCount + accentWordCount}
          animate={animate}
        />
      </span>
    </h1>
  );
};
