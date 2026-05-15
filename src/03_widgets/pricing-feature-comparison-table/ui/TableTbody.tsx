import { Fragment } from 'react';
import { cn } from '@/shared/model/libs/cn';
import type { TComparisonValue } from '@/entities/comparison-row';

type TCompareRow = {
  feature: string;
  values: [TComparisonValue, TComparisonValue, TComparisonValue];
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

const renderValue = (val: TComparisonValue, isHighlight: boolean) => {
  if (val.kind === 'check') {
    return (
      <span
        className={cn(
          'text-lg font-bold leading-none',
          isHighlight ? 'text-primary-ink' : 'text-primary',
        )}
        aria-hidden="true"
      >
        ✓
      </span>
    );
  }
  if (val.kind === 'cross') {
    return (
      <span className="text-lg leading-none text-faint" aria-hidden="true">
        —
      </span>
    );
  }
  if (val.kind === 'partial') {
    return <span className="text-muted">{val.text}</span>;
  }
  return <span>{val.text}</span>;
};

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
                  const isCheck = val.kind === 'check';
                  const isCross = val.kind === 'cross';
                  return (
                    <td
                      key={`${row.feature}-${i}`}
                      className={cn(
                        'px-3.5 py-3.5 text-center',
                        !isLast && 'border-b border-line',
                        isHighlight && 'bg-primary-pale font-bold text-primary-ink',
                        !isHighlight && isCheck && 'font-bold text-primary',
                        !isHighlight && isCross && 'text-faint',
                        !isHighlight && !isCheck && !isCross && 'text-ink',
                      )}
                    >
                      {renderValue(val, isHighlight)}
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
