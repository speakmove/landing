/** A single legend line: a cost row, the cost subtotal, or the margin. */
export type TLegendRow = {
  /** Stable key (label is fine — labels are unique within the section). */
  label: string;
  /** Money amount as a fixed "X.XX" string (already localised by RSC). */
  amount: string;
  /** Percent of the £9.90 total, e.g. "35%" (precomputed in RSC). */
  percent: string;
  /**
   * Cumulative £ threshold at which this row "lights up" as the centre
   * counter sweeps 0 → 9.90. Rows turn on in array order as the count
   * crosses each threshold.
   */
  threshold: number;
  /** Visual role — drives swatch colour and emphasis (map, not if-else). */
  kind: 'cost' | 'subtotal' | 'margin';
};

export type TUnitEconomicsChartProps = {
  /** Localised currency symbol, e.g. "£". */
  currency: string;
  /** Localised kicker shown under the centre total (e.g. "Прозрачно"). */
  kicker: string;
  /** Cost rows + subtotal + margin, in light-up order, with thresholds. */
  rows: readonly TLegendRow[];
  /** The grand total the counter sweeps to (9.90). */
  total: number;
};
