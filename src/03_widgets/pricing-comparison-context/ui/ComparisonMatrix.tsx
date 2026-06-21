import { cn } from '@/shared/model/libs/cn';
import { OWN_COLUMN_INDEX } from '../model/types';
import type { TMatrix, TRow } from '../model/types';
import { ComparisonRow } from './ComparisonRow';

type TProps = {
  matrix: TMatrix;
  rows: TRow[];
};

const isOwn = (col: number) => col === OWN_COLUMN_INDEX;

/**
 * Accessible comparison matrix: a real `<table>` (caption + col/row headers).
 * Cell meaning lives in VisuallyHidden text inside `ComparisonRow`, not in
 * colour/icon alone. The own column (SpeakMove) gets the primary-pale highlight.
 * Mobile (M1): narrow icon columns + short headers, fits 320px.
 */
export const ComparisonMatrix = ({ matrix, rows }: TProps) => {
  const { columns, markLabels } = matrix;

  return (
    /* Horizontal scroll lives INSIDE the table area (not the page) on narrow
       screens — full column names stay on one line, the criterion column keeps
       a readable min-width, so the table overflows here and scrolls locally. */
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left">
        <caption className="sr-only">{matrix.title}</caption>

        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="min-w-44 px-1 py-3 text-12 font-semibold text-muted sm:px-3 sm:text-13"
            >
              {matrix.criterionLabel}
            </th>
            {columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={cn(
                  'whitespace-nowrap px-3 py-3 text-center align-bottom text-12 font-semibold sm:text-14-5',
                  isOwn(i)
                    ? 'rounded-t-card bg-primary-pale text-primary-ink'
                    : 'text-muted',
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <ComparisonRow
              key={row.criterion}
              row={row}
              markLabels={markLabels}
              isLast={rowIndex === rows.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
