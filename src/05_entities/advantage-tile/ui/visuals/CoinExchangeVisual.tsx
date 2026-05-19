import { Coin } from '@/shared/ui';

type TProps = {
  vizEquals?: string;
  vizCap?: string;
};

/**
 * Coin exchange visual for the "Монеты — это cashback за прогресс" advantage tile.
 * Layout: big SM-coin, equals sign, $1 pill. Optional cap label below.
 */
export const CoinExchangeVisual = ({ vizEquals, vizCap }: TProps) => {
  return (
    <div className="mt-5 flex flex-1 flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-4">
        <Coin size="3xl" text="SM" />
        <span className="font-mono text-2xl font-extrabold text-muted">=</span>
        <span className="rounded-2xl border border-gold bg-gold-pale px-4 py-2 font-mono text-xl font-extrabold text-ink">
          $1
        </span>
      </div>
      {vizEquals ? (
        <div className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs font-bold text-ink">
          {vizEquals}
        </div>
      ) : null}
      {vizCap ? <p className="m-0 text-xs text-muted">{vizCap}</p> : null}
    </div>
  );
};
