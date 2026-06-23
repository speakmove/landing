import type { TLegendRow } from './types';

/** Row background per kind. */
export const KIND_ROW: Record<TLegendRow['kind'], string> = {
  cost: 'odd:bg-surface-soft',
  subtotal: 'border-t-2 border-line bg-surface-soft',
  margin: 'bg-gold-pale',
};

/** Swatch colour for non-cost kinds (cost rows resolve per-index via COST_SWATCH). */
export const KIND_SWATCH: Record<TLegendRow['kind'], string> = {
  cost: '',
  subtotal: '',
  margin: 'bg-gold-accent',
};

/** Label colour per kind. */
export const KIND_LABEL: Record<TLegendRow['kind'], string> = {
  cost: 'text-muted',
  subtotal: 'font-bold text-ink',
  margin: 'font-bold text-gold-deep',
};

/** Percent colour per kind. */
export const KIND_PERCENT: Record<TLegendRow['kind'], string> = {
  cost: 'text-faint',
  subtotal: 'text-faint',
  margin: 'text-gold-mid',
};

/** Amount colour per kind. */
export const KIND_AMOUNT: Record<TLegendRow['kind'], string> = {
  cost: 'text-ink',
  subtotal: 'font-bold text-ink',
  margin: 'font-bold text-gold-deep',
};

/**
 * Cost-row swatches, indexed by cost-row position. MUST match the
 * conic-gradient stops in `.ue-donut` (app/globals.css) so the legend reads
 * as a key to the ring. 5 emerald steps (dark → light).
 */
export const COST_SWATCH = [
  'bg-primary-ink', // STT (darkest)
  'bg-primary', // LLM
  'bg-primary-hover', // TTS (largest cost)
  'bg-emerald-400', // payment processing
  'bg-emerald-300', // hosting (lightest)
] as const;
