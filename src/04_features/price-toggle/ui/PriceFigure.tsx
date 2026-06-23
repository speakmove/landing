'use client';

import { VisuallyHidden } from '@/shared/ui';
import { usePriceMorph } from '../model/hooks/usePriceMorph';
import type { TPriceModeData } from '../model/types';

type TProps = {
  mode: TPriceModeData;
};

/**
 * The morphing big figure + its instant unit suffix.
 *
 * The figure always *counts* to its target (see `usePriceMorph`); transient
 * frames are written straight to the DOM node via `figureRef`, so this
 * component does not re-render per animation frame. A single visually-hidden
 * `aria-live` node announces the new value once per mode change.
 */
export const PriceFigure = ({ mode }: TProps) => {
  const { figureRef, display, announce } = usePriceMorph(mode);

  return (
    <div className="flex items-baseline gap-2">
      {/* Single SR announcement per mode change — not per animation frame. */}
      <VisuallyHidden aria-live="polite">{announce}</VisuallyHidden>

      <span
        ref={figureRef}
        aria-hidden="true"
        className="font-extrabold tracking-tight text-white text-5xl md:text-6xl tabular-nums"
      >
        {display}
      </span>
      <span
        aria-hidden="true"
        className="font-semibold text-white/70 text-base md:text-lg"
      >
        {mode.unit}
      </span>
    </div>
  );
};
