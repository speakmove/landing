/** Identifier for each price-toggle segment. */
export type TPriceModeId = 'month' | 'day' | 'coffee';

/**
 * One segment of the price toggle (I1).
 *
 * `amount` is the display string straight from i18n (e.g. "£9.90", "< 1").
 * `value` is the optional numeric value used to morph the big figure between
 * modes; modes without a `value` (e.g. "vs coffee") swap instantly.
 * `unit` and `label` always swap instantly (no morph).
 */
export type TPriceModeData = {
  id: TPriceModeId;
  /** Segment-control label, e.g. "в месяц". */
  label: string;
  /** Display amount string, e.g. "£9.90" or "< 1". */
  amount: string;
  /** Unit/suffix shown after the figure, e.g. "/мес". */
  unit: string;
  /** Numeric value for the morphing counter. Omit for non-numeric modes. */
  value?: number;
};
