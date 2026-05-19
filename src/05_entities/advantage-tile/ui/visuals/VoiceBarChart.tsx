import type { CSSProperties } from 'react';
import { buildBarHeights } from '@/shared/model/utils';

/**
 * Decorative voice-message bar chart used inside the "Голосовые диалоги" advantage tile.
 * CSS-only — each bar is a `<span>` whose height is driven by a CSS custom property,
 * so heights stay deterministic between SSR and client.
 */
export const VoiceBarChart = () => {
  const bars = buildBarHeights(30, 7, [22, 100]);
  return (
    <div
      aria-hidden="true"
      className="mt-5 flex h-22 flex-1 items-end justify-between gap-1.5"
    >
      {bars.map((h, i) => (
        <span
          key={i}
          style={{ '--bar-h': `${h}%` } as CSSProperties}
          className="block h-(--bar-h) w-full rounded-t-md bg-primary"
        />
      ))}
    </div>
  );
};
