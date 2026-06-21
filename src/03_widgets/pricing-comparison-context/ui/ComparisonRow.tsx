import type { PropsWithChildren, ReactNode } from 'react';
import { CheckIcon, MinusIcon, PartialIcon, VisuallyHidden } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import { OWN_COLUMN_INDEX } from '../model/types';
import type { TMark, TMarkLabels, TRow } from '../model/types';

/** Mark glyph per value (map, not if-else). Icons are decorative — the cell's
 *  meaning is carried by the VisuallyHidden label for SR/SEO. */
const MARK_ICON: Record<TMark, ReactNode> = {
  yes: <CheckIcon size={18} className="text-primary" />,
  no: <MinusIcon size={18} className="text-faint" />,
  partial: <PartialIcon size={18} className="text-muted" />,
};

const isOwn = (col: number) => col === OWN_COLUMN_INDEX;

/** A single `<td>` carrying the own-column highlight + bottom rounding. */
const Cell = ({
  col,
  isLast,
  children,
}: PropsWithChildren<{ col: number; isLast: boolean }>) => (
  <td
    className={cn(
      'px-1 py-3 text-center sm:px-3',
      isOwn(col) && 'bg-primary-pale',
      isOwn(col) && isLast && 'rounded-b-card',
    )}
  >
    {children}
  </td>
);

type TProps = {
  row: TRow;
  markLabels: TMarkLabels;
  /** Last body row — rounds the bottom of the highlighted own-column. */
  isLast: boolean;
};

/** One comparison table row: row-header criterion + one cell per column. */
export const ComparisonRow = ({ row, markLabels, isLast }: TProps) => (
  <tr className="border-b border-line/70">
    <th
      scope="row"
      className="min-w-44 px-1 py-3 text-12 font-normal text-pretty text-ink sm:px-3 sm:text-14-5"
    >
      {row.criterion}
    </th>

    {row.kind === 'mark'
      ? row.values.map((value, col) => (
          <Cell key={col} col={col} isLast={isLast}>
            <span className="inline-flex items-center justify-center">
              {MARK_ICON[value]}
              <VisuallyHidden>{markLabels[value]}</VisuallyHidden>
            </span>
          </Cell>
        ))
      : row.values.map((value, col) => (
          <Cell key={col} col={col} isLast={isLast}>
            <span
              className={cn(
                'whitespace-nowrap text-12 tabular-nums sm:text-14-5',
                isOwn(col) ? 'font-bold text-primary' : 'text-muted',
              )}
            >
              {value}
            </span>
          </Cell>
        ))}
  </tr>
);
