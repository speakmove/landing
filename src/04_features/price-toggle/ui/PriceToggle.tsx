'use client';

import { useId, useState } from 'react';
import { PriceFigure } from './PriceFigure';
import { SegmentControl } from './SegmentControl';
import type { TPriceModeData, TPriceModeId } from '../model/types';

type TProps = {
  modes: TPriceModeData[];
  /** Which segment is active on first paint. */
  defaultMode?: TPriceModeId;
};

/**
 * Price toggle (I1) — segment control + morphing big figure, rendered inside
 * the emerald split panel of the home/pricing card.
 *
 * - The big figure always *counts* to its target (month ↔ day ↔ vs coffee).
 *   See `usePriceMorph`.
 * - The unit and the segment labels swap instantly — no animation.
 * - `prefers-reduced-motion`: every change is instant.
 *
 * Thin orchestrator: owns the active-mode state and composes `PriceFigure`
 * (the morphing figure) with `SegmentControl` (the tablist). Composed at the
 * widget level and passed into `PricingCard`'s `priceSlot`, keeping the entity
 * free of feature-layer imports (FSD).
 */
export const PriceToggle = ({ modes, defaultMode = 'day' }: TProps) => {
  const groupId = useId();

  const fallback = modes[0];
  const initial = modes.find((m) => m.id === defaultMode) ?? fallback;

  const [activeId, setActiveId] = useState<TPriceModeId | undefined>(
    initial?.id,
  );

  const active = modes.find((m) => m.id === activeId) ?? fallback;

  // No modes → render nothing rather than crash (defensive, i18n could be empty).
  if (!active) return null;

  return (
    <div>
      <PriceFigure mode={active} />

      <SegmentControl
        modes={modes}
        activeId={active.id}
        onSelect={setActiveId}
        groupId={groupId}
        label={active.label}
      />
    </div>
  );
};
