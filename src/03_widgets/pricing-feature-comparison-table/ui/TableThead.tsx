import { cn } from '@/shared/model/libs/cn';

type TProps = {
  featureColLabel: string;
  colHeaders: [string, string, string];
  highlightColumn: string;
};

export const TableThead = ({ featureColLabel, colHeaders, highlightColumn }: TProps) => {
  return (
    <thead>
      <tr className="border-b border-line bg-surface">
        <th
          scope="col"
          className="py-3 px-4 text-left font-semibold text-muted w-[40%]"
        >
          {featureColLabel}
        </th>
        {colHeaders.map((col) => (
          <th
            key={col}
            scope="col"
            className={cn(
              'py-3 px-4 text-center font-bold',
              col === highlightColumn
                ? 'text-gold bg-gold-pale'
                : 'text-ink',
            )}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};
