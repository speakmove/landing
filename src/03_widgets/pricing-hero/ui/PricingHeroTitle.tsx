'use client';

import type { TSegment } from '@/shared/ui';
import { SplitTextReveal } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  title: string;
  className?: string;
};

// Em-dash separates the value clause ("£9.90 a month") from the reframe
// ("less than a coffee a day"). We accent the value clause so the price
// pops, then let the rest read plainly. The dash + surrounding spaces are
// preserved as a non-accent segment so the line renders faithfully.
const buildSegments = (title: string): TSegment[] => {
  const dashIndex = title.indexOf('—');

  if (dashIndex === -1) {
    return [{ text: title }];
  }

  const accent = title.slice(0, dashIndex).trimEnd();
  const rest = title.slice(dashIndex);

  return [{ text: accent, accent: true }, { text: ` ${rest}` }];
};

export const PricingHeroTitle = ({ title, className }: TProps) => (
  <h1
    className={cn(
      'h-display-page my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink',
      className,
    )}
    aria-label={title}
  >
    <span aria-hidden="true">
      <SplitTextReveal segments={buildSegments(title)} />
    </span>
  </h1>
);
