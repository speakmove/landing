import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';
import { Badge, Card } from '@/shared/ui';
import type { TAdvantageTile } from '../model/types';

type TProps = {
  tile: TAdvantageTile;
  className?: string;
};

export const AdvantageTile = async ({ tile, className }: TProps) => {
  const tCommon = await getTranslations('Common');
  return (
    <Card as="article" className={className}>
      {tile.badge && (
        <Badge tone="primary" className="mb-3">
          {tile.badge}
        </Badge>
      )}

      <h3 className="text-[17px] font-bold text-ink mb-2 leading-snug">
        {tile.title}
      </h3>

      <p className="text-sm text-muted leading-relaxed mb-3">
        {tile.description}
      </p>

      {tile.vizEquals && (
        <div className="mt-3 mb-2">
          <span className="inline-block font-mono text-sm font-bold text-ink bg-gold-pale rounded-lg px-3 py-1.5 border border-gold">
            {tile.vizEquals}
          </span>
          {tile.vizCap && (
            <p className="mt-1.5 text-xs text-muted">{tile.vizCap}</p>
          )}
        </div>
      )}

      {tile.levels && tile.levels.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-2" aria-label={tCommon('aria.cefrLevels')}>
          {tile.levels.map((level) => (
            <li key={level}>
              <span
                className={cn(
                  'inline-block rounded-lg px-3 py-1 text-xs font-bold border',
                  tile.currentLevel === level
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-muted border-line',
                )}
              >
                {level}
              </span>
            </li>
          ))}
        </ul>
      )}

      {tile.items && tile.items.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5" aria-label={tCommon('aria.tasks')}>
          {tile.items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-ink">{item.label}</span>
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
        <div className="mt-3 rounded-xl border border-line bg-surface p-3">
          <p className="text-sm font-bold text-ink">
            {tile.certificateName}
          </p>
          {tile.certificateIssuer && (
            <p className="text-xs text-muted mt-0.5">
              {tile.certificateIssuer}
            </p>
          )}
          {tile.certificateStatus && (
            <p className="text-[11px] text-muted mt-1 italic">
              {tile.certificateStatus}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
