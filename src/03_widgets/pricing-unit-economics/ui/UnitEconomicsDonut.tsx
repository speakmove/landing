'use client';

import { memo } from 'react';

type TProps = {
  /** Stable ref setter for the ring element (`--ue-reveal` written here). */
  donutRef: (node: HTMLElement | null) => void;
  /** Stable ref setter for the centre figure (transient count text). */
  figureRef: (node: HTMLElement | null) => void;
  currency: string;
  kicker: string;
  total: number;
};

/**
 * Decorative conic-gradient ring + centre figure. The draw angle and the
 * counting figure are written straight to the DOM by `useUnitEconomicsDraw`
 * via the ref setters — this component never re-renders during the animation
 * (memoised; all props are stable), so the legend's `visibleCount` updates
 * don't reconcile the ring.
 */
const UnitEconomicsDonutBase = ({
  donutRef,
  figureRef,
  currency,
  kicker,
  total,
}: TProps) => (
  <div className="justify-self-center">
    <div className="relative" aria-hidden="true">
      <div ref={donutRef} className="ue-donut" />
      <div className="ue-donut-center">
        <span className="ue-donut-total">
          {currency}
          <span ref={figureRef}>{total.toFixed(2)}</span>
        </span>
        <span className="mt-1.5 text-12 font-medium uppercase tracking-wide text-faint">
          {kicker}
        </span>
      </div>
    </div>
  </div>
);

export const UnitEconomicsDonut = memo(UnitEconomicsDonutBase);
