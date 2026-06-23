'use client';

import type { TSegment } from '@/shared/ui';
import { SplitTextReveal } from '@/shared/ui';

type TProps = {
  title: string;
};

/**
 * The PageHero title reads as two sentences: a lead clause ("English speaking
 * practice — 15 minutes by voice.") and a reframe ("On UK scenarios."). We
 * accent the trailing sentence so the differentiating "UK scenarios" clause
 * pops while the lead reads plainly.
 *
 * Splitting on the LAST ". " (period + whitespace) is locale-robust: ru/uk/en
 * all share the two-sentence shape, and any extra punctuation (e.g. the en
 * em-dash) stays inside the non-accent lead segment untouched.
 */
const buildSegments = (title: string): TSegment[] => {
  const dotIndex = title.lastIndexOf('. ');

  if (dotIndex === -1) {
    return [{ text: title }];
  }

  // Keep the period + space on the lead segment so the line reads faithfully;
  // accent only the trailing sentence.
  const lead = title.slice(0, dotIndex + 2);
  const tail = title.slice(dotIndex + 2);

  if (tail.length === 0) {
    return [{ text: title }];
  }

  return [{ text: lead }, { text: tail, accent: true }];
};

export const PageHeroTitle = ({ title }: TProps) => (
  <h1
    className="h-display-page my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink"
    aria-label={title}
  >
    <span aria-hidden="true">
      <SplitTextReveal segments={buildSegments(title)} />
    </span>
  </h1>
);
