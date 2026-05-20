import { cn } from '@/shared/model/libs/cn';
import {
  HEADER_ICON_BY_ID,
  HEADER_TONE_BY_ID,
  badgeToneClass,
  renderTileVisual,
} from '../model/maps';
import type { TAdvantageTile } from '../model/types';

type TProps = {
  tile: TAdvantageTile;
  className?: string;
};

/**
 * Bento-grid advantage tile. Header (optional icon + title + description +
 * optional badge) is rendered here; the in-tile visual and the tone/icon
 * mappings live in ../model/maps so the UI file stays focused.
 */
export const AdvantageTile = ({ tile, className }: TProps) => {
  const icon = HEADER_ICON_BY_ID[tile.id];
  const tone = HEADER_TONE_BY_ID[tile.id] ?? 'bg-primary-pale text-primary';

  return (
    <article
      className={cn(
        'card-hover relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white p-6 shadow-(--shadow-soft)',
        className,
      )}
    >
      {tile.badge ? (
        <span
          className={cn(
            'absolute right-4 top-4 rounded-full px-2 py-1 text-xs font-extrabold uppercase tracking-wider',
            badgeToneClass(tile.badge.kind),
          )}
        >
          {tile.badge.text}
        </span>
      ) : null}

      {icon ? (
        <div className={cn('grid h-10 w-10 place-items-center rounded-xl', tone)}>
          {icon}
        </div>
      ) : null}

      <h3 className={cn(icon ? 'mt-4' : 'mt-0', 'mb-2 text-xl font-bold text-ink')}>
        {tile.title}
      </h3>
      <p className="m-0 text-sm leading-relaxed text-muted">{tile.description}</p>

      {renderTileVisual(tile)}
    </article>
  );
};
