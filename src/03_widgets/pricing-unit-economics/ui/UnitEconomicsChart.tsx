'use client';

import { useMemo } from 'react';
import { useUnitEconomicsDraw } from '../model/hooks/useUnitEconomicsDraw';
import { COST_SWATCH } from '../model/maps';
import type { TUnitEconomicsChartProps } from '../model/types';
import { UnitEconomicsDonut } from './UnitEconomicsDonut';
import { UnitEconomicsLegendRow } from './UnitEconomicsLegendRow';

/**
 * Orchestrates the draw-in: a single rAF (in `useUnitEconomicsDraw`) writes the
 * ring angle + centre figure straight to the DOM and exposes `visibleCount`.
 * The donut is memoised (never re-renders during the draw); each legend row is
 * memoised too, so a `visibleCount` bump reconciles only the row that just lit.
 */
export const UnitEconomicsChart = ({
  currency,
  kicker,
  rows,
  total,
}: TUnitEconomicsChartProps) => {
  // Stable thresholds so the draw effect doesn't re-run each render.
  const thresholds = useMemo(() => rows.map((r) => r.threshold), [rows]);

  const { donutRef, figureRef, sectionRef, visibleCount } = useUnitEconomicsDraw(
    total,
    thresholds,
  );

  // Cost-row swatch colour by cost-row position (subtotal/margin excluded),
  // precomputed so it stays index-stable without mutating a counter in render.
  const costSwatchByRow = useMemo(() => {
    const map = new Map<string, string>();
    let n = 0;
    for (const row of rows) {
      if (row.kind === 'cost') {
        map.set(row.label, COST_SWATCH[n] ?? 'bg-primary');
        n += 1;
      }
    }
    return map;
  }, [rows]);

  return (
    <div
      ref={sectionRef}
      className="mx-auto grid max-w-3xl items-center gap-10 md:grid-cols-[auto_1fr] md:gap-12"
    >
      <UnitEconomicsDonut
        donutRef={donutRef}
        figureRef={figureRef}
        currency={currency}
        kicker={kicker}
        total={total}
      />

      <ul className="flex flex-col gap-px overflow-hidden rounded-card border border-line bg-white shadow-(--shadow-soft)">
        {rows.map((row, i) => (
          <UnitEconomicsLegendRow
            key={row.label}
            row={row}
            currency={currency}
            costSwatch={costSwatchByRow.get(row.label) ?? 'bg-primary'}
            isVisible={i < visibleCount}
          />
        ))}
      </ul>
    </div>
  );
};
