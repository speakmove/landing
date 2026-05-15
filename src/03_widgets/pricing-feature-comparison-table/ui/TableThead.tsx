import { cn } from '@/shared/model/libs/cn';

type TProps = {
  featureColLabel: string;
  colHeaders: [string, string, string];
  highlightColumn: string;
};

export const TableThead = ({ featureColLabel, colHeaders, highlightColumn }: TProps) => {
  return (
    <thead>
      <tr>
        <th
          scope="col"
          className="min-w-65 border-b border-line bg-[#fafbf8] px-3.5 py-3.5 text-left text-[13px] font-bold text-ink"
        >
          <span className="sr-only">{featureColLabel}</span>
        </th>
        {colHeaders.map((col) => (
          <th
            key={col}
            scope="col"
            className={cn(
              'border-b border-line px-3.5 py-3.5 text-center text-[13px] font-bold',
              col === highlightColumn ? 'bg-primary-pale text-primary-ink' : 'bg-[#fafbf8] text-ink',
            )}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};
