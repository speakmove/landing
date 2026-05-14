import { Fragment } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TCompareRow = {
  feature: string;
  values: [string, string, string];
};

type TCompareGroup = {
  name: string;
  rows: TCompareRow[];
};

type TProps = {
  groups: TCompareGroup[];
  colHeaders: [string, string, string];
  highlightColumn: string;
};

const CHECK = '✓';

export const TableTbody = ({ groups, colHeaders, highlightColumn }: TProps) => {
  return (
    <tbody>
      {groups.map((group, gIdx) => (
        <Fragment key={`group-${group.name}-${gIdx}`}>
          <tr className="bg-primary-pale">
            <th
              colSpan={4}
              scope="colgroup"
              className="border-y-2 border-primary px-3.5 py-3.5 text-left text-[13px] font-extrabold uppercase tracking-[0.08em] text-primary-ink"
            >
              {group.name}
            </th>
          </tr>
          {group.rows.map((row, rIdx) => {
            const isLastGroup = gIdx === groups.length - 1;
            const isLastRow = rIdx === group.rows.length - 1;
            const isLast = isLastGroup && isLastRow;
            return (
              <tr key={row.feature}>
                <th
                  scope="row"
                  className={cn(
                    'px-3.5 py-3.5 text-left font-medium text-muted',
                    !isLast && 'border-b border-line',
                  )}
                >
                  {row.feature}
                </th>
                {row.values.map((val, i) => {
                  const colName = colHeaders[i];
                  const isHighlight = colName === highlightColumn;
                  const isCheck = val === '✓' || val === CHECK;
                  const isDash = val === '—';
                  return (
                    <td
                      key={`${row.feature}-${i}`}
                      className={cn(
                        'px-3.5 py-3.5 text-center',
                        !isLast && 'border-b border-line',
                        isHighlight && 'bg-primary-pale font-bold text-primary-ink',
                        !isHighlight && isCheck && 'font-bold text-primary',
                        !isHighlight && isDash && 'text-faint',
                        !isHighlight && !isCheck && !isDash && 'text-ink',
                      )}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </Fragment>
      ))}
    </tbody>
  );
};
