import type { TCoinFlowRow } from '../model/types';

type TProps = {
  title: string;
  rows: TCoinFlowRow[];
  captionLabel: string;
  actionLabel: string;
  amountLabel: string;
  coinsLabel?: string;
  usdLabel?: string;
};

export const CoinFlowTable = ({
  title,
  rows,
  captionLabel,
  actionLabel,
  amountLabel,
  coinsLabel,
  usdLabel,
}: TProps) => {
  const hasUsd = rows.some((r) => r.usd !== undefined);

  return (
    <div className="rounded-2xl border border-line bg-white shadow-(--shadow-soft) overflow-hidden">
      <div className="px-5 py-4 border-b border-line bg-surface">
        <h3 className="font-bold text-[17px] text-ink">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <caption className="sr-only">{captionLabel}</caption>
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted"
            >
              {actionLabel}
            </th>
            {hasUsd && coinsLabel ? (
              <th
                scope="col"
                className="px-5 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {coinsLabel}
              </th>
            ) : null}
            <th
              scope="col"
              className="px-5 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted"
            >
              {hasUsd ? (usdLabel ?? amountLabel) : amountLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-line last:border-0 hover:bg-surface transition-colors"
            >
              <th
                scope="row"
                className="px-5 py-3 text-left font-normal text-ink"
              >
                {row.what}
              </th>
              {hasUsd && coinsLabel ? (
                <td className="px-5 py-3 text-right font-mono font-semibold text-primary-ink whitespace-nowrap">
                  {row.amount}
                </td>
              ) : null}
              <td className="px-5 py-3 text-right font-mono font-semibold text-primary-ink whitespace-nowrap">
                {hasUsd ? (row.usd ?? '—') : row.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
