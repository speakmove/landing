'use client';

import type { CSSProperties, ElementType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_EASE } from '@/shared/ui/motion/constants';
import { cn } from '@/shared/model/libs/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TSegment = {
  text: string;
  accent?: boolean;
};

type TProps = {
  segments: TSegment[];
  className?: string;
  /** Wrapper element tag. Defaults to "span" so the caller controls the block element. */
  as?: ElementType;
  /** Extra className applied to each accent segment's wrapper span. */
  accentClassName?: string;
  /**
   * Inline style applied to each accent segment's wrapper span.
   * Accepted JS→CSS bridge for CSS custom properties (e.g. --accent-delay)
   * that keyframe animations read via var(). Not for arbitrary layout.
   */
  accentStyle?: CSSProperties;
};

// ─── Motion variants ─────────────────────────────────────────────────────────

/**
 * Parent container: drives staggerChildren so all letters across all segments
 * share one continuous stagger timeline.
 */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
} as const;

/**
 * Per-letter variant: blur(12px) + opacity 0 + translateY(0.32em) → clear.
 * Duration ~0.7s with smooth deceleration.
 */
const letterVariants = {
  hidden: {
    opacity: 0,
    y: '0.32em',
    filter: 'blur(12px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: MOTION_EASE.out,
    },
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Split a text string into word chunks, preserving whitespace tokens so we
 * can render spaces faithfully. Returns an alternating array of word / space
 * strings (any non-empty chunk from the split).
 */
const splitIntoChunks = (text: string): string[] =>
  text.split(/(\s+)/).filter((chunk) => chunk.length > 0);

/**
 * Render letters of a single word as staggered motion.spans.
 * keyPrefix must be globally unique across all segments/words.
 */
const LetterSpans = ({
  word,
  keyPrefix,
}: {
  word: string;
  keyPrefix: string;
}) => (
  <>
    {word.split('').map((letter, i) => (
      <motion.span
        key={`${keyPrefix}-l${i}`}
        className="inline-block"
        variants={letterVariants}
      >
        {letter}
      </motion.span>
    ))}
  </>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const SplitTextReveal = ({
  segments,
  className,
  as: Tag = 'span',
  accentClassName,
  accentStyle,
}: TProps) => {
  const shouldReduceMotion = useReducedMotion();

  // Reduced-motion: render plain text with accent coloring, no animation.
  if (shouldReduceMotion) {
    return (
      <Tag className={className}>
        {segments.map((seg, si) =>
          seg.accent ? (
            <span
              key={si}
              className={cn('text-primary', accentClassName)}
              style={accentStyle}
            >
              {seg.text}
            </span>
          ) : (
            seg.text
          ),
        )}
      </Tag>
    );
  }

  // Animated: split every segment into words → letters.
  // Words are wrapped in white-space:nowrap inline-block spans to prevent
  // mid-word line breaks when letters become individual inline-blocks.
  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {segments.map((seg, si) => {
          const chunks = splitIntoChunks(seg.text);

          const content = chunks.map((chunk, ci) => {
            // Whitespace token — render as plain space span, not animated.
            if (chunk.trim().length === 0) {
              return (
                <span key={`s${si}-c${ci}-space`} className="inline-block">
                  {chunk}
                </span>
              );
            }

            // Word token — wrap in nowrap span, animate each letter.
            return (
              <span
                key={`s${si}-c${ci}-word`}
                className="inline-block whitespace-nowrap"
              >
                <LetterSpans word={chunk} keyPrefix={`s${si}-c${ci}`} />
              </span>
            );
          });

          // Accent segment: wrap in a span that the caller can style
          // (e.g. accent-underline + text-primary) without breaking the
          // per-letter stagger — the wrapper is not a motion element.
          if (seg.accent) {
            return (
              <span
                key={`seg-${si}`}
                className={cn('text-primary', accentClassName)}
                style={accentStyle}
              >
                {content}
              </span>
            );
          }

          return <span key={`seg-${si}`}>{content}</span>;
        })}
      </motion.span>
    </Tag>
  );
};
