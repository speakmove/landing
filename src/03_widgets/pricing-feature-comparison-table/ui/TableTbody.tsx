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

export const TableTbody = ({ groups, colHeaders, highlightColumn }: TProps) => {
  return (
    <tbody>
      {groups.map((group) => (
        <>
          <tr
            key={`group-${group.name}`}
            className="border-b border-line bg-surface"
          >
            <th
              colSpan={4}
              scope="colgroup"
              className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider text-muted"
            >
              {group.name}
            </th>
          </tr>
          {group.rows.map((row) => (
            <tr
              key={row.feature}
              className="border-b border-line last:border-0 even:bg-surface/40"
            >
              <th
                scope="row"
                className="py-3 px-4 text-left font-normal text-ink"
              >
                {row.feature}
              </th>
              {row.values.map((val, i) => {
                const colName = colHeaders[i];
                const isHighlight = colName === highlightColumn;
                return (
                  <td
                    key={i}
                    className={cn(
                      'py-3 px-4 text-center',
                      isHighlight
                        ? 'bg-gold-pale/30 text-ink font-medium'
                        : 'text-muted',
                      val === '—' && 'opacity-40',
                    )}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </>
      ))}
    </tbody>
  );
};
