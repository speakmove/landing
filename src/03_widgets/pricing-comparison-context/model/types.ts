export type TMark = 'yes' | 'no' | 'partial';

export type TMarkRow = {
  criterion: string;
  kind: 'mark';
  values: TMark[];
};

export type TPriceRow = {
  criterion: string;
  kind: 'price';
  values: string[];
};

export type TRow = TMarkRow | TPriceRow;

export type TMarkLabels = Record<TMark, string>;

export type TMatrix = {
  title: string;
  criterionLabel: string;
  columns: string[];
  columnsShort: string[];
  markLabels: TMarkLabels;
  rows: TRow[];
};

/** Our own column lives at this index — it gets the primary-pale highlight. */
export const OWN_COLUMN_INDEX = 2;
