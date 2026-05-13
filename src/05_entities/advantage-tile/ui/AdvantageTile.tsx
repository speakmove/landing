import { Badge, Card } from '@/shared/ui';
import type { TAdvantageTile } from '../model/types';

type TProps = {
  tile: TAdvantageTile;
  className?: string;
};

export function AdvantageTile({ tile, className }: TProps) {
  return (
    <Card as="article" className={className}>
      {tile.badge && (
        <Badge tone="primary" className="mb-3">
          {tile.badge}
        </Badge>
      )}

      <h3 className="text-[17px] font-bold text-[color:var(--color-ink)] mb-2 leading-snug">
        {tile.title}
      </h3>

      <p className="text-[14px] text-[color:var(--color-muted)] leading-relaxed mb-3">
        {tile.description}
      </p>

      {tile.vizEquals && (
        <div className="mt-3 mb-2">
          <span className="inline-block font-mono text-[15px] font-bold text-[color:var(--color-ink)] bg-[color:var(--color-gold-pale)] rounded-lg px-3 py-1.5 border border-[color:var(--color-gold)]">
            {tile.vizEquals}
          </span>
          {tile.vizCap && (
            <p className="mt-1.5 text-[12px] text-[color:var(--color-muted)]">{tile.vizCap}</p>
          )}
        </div>
      )}

      {tile.levels && tile.levels.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-2" aria-label="Уровни CEFR">
          {tile.levels.map((level) => (
            <li key={level}>
              <span
                className={[
                  'inline-block rounded-lg px-3 py-1 text-[13px] font-bold border',
                  tile.currentLevel === level
                    ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]'
                    : 'bg-[color:var(--color-surface)] text-[color:var(--color-muted)] border-[color:var(--color-line)]',
                ].join(' ')}
              >
                {level}
              </span>
            </li>
          ))}
        </ul>
      )}

      {tile.items && tile.items.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5" aria-label="Задания">
          {tile.items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between text-[13px]"
            >
              <span className="text-[color:var(--color-ink)]">{item.label}</span>
              {item.reward && (
                <Badge tone="gold" className="text-[11px]">
                  {item.reward}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}

      {tile.certificateName && (
        <div className="mt-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-3">
          <p className="text-[14px] font-bold text-[color:var(--color-ink)]">
            {tile.certificateName}
          </p>
          {tile.certificateIssuer && (
            <p className="text-[12px] text-[color:var(--color-muted)] mt-0.5">
              {tile.certificateIssuer}
            </p>
          )}
          {tile.certificateStatus && (
            <p className="text-[11px] text-[color:var(--color-muted)] mt-1 italic">
              {tile.certificateStatus}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
