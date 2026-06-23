'use client';

import { memo } from 'react';
import { cn } from '@/shared/model/libs/cn';
import {
  KIND_AMOUNT,
  KIND_LABEL,
  KIND_PERCENT,
  KIND_ROW,
  KIND_SWATCH,
} from '../model/maps';
import type { TLegendRow } from '../model/types';

type TProps = {
  row: TLegendRow;
  currency: string;
  /** Resolved swatch colour for cost rows (matches the conic segment). */
  costSwatch: string;
  /** Lit state — flips once when the counter crosses this row's threshold. */
  isVisible: boolean;
};

/**
 * One legend row. Memoised: during the draw only the row whose `isVisible`
 * just flipped re-renders — the rest (and the donut) stay put.
 */
const UnitEconomicsLegendRowBase = ({
  row,
  currency,
  costSwatch,
  isVisible,
}: TProps) => {
  const showSwatch = row.kind !== 'subtotal';
  const swatchColor = row.kind === 'cost' ? costSwatch : KIND_SWATCH[row.kind];

  return (
    <li
      className={cn(
        'flex items-center gap-3 px-4 py-3 transition-all duration-500 ease-out',
        KIND_ROW[row.kind],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
      )}
    >
      <span
        className={cn('size-3 shrink-0', showSwatch && 'rounded-3', showSwatch && swatchColor)}
        aria-hidden="true"
      />
      <span className={cn('min-w-0 flex-1 text-14-5', KIND_LABEL[row.kind])}>
        {row.label}
      </span>
      <span className={cn('font-mono text-13 tabular-nums', KIND_PERCENT[row.kind])}>
        {row.percent}
      </span>
      <span
        className={cn('w-16 text-right font-mono text-15 tabular-nums', KIND_AMOUNT[row.kind])}
      >
        {currency}
        {row.amount}
      </span>
    </li>
  );
};

export const UnitEconomicsLegendRow = memo(UnitEconomicsLegendRowBase);
