import { cn } from '@/shared/model/libs/cn';
import { VoiceWave } from '@/shared/ui';
import {
  HEADER_ICON_BY_ID,
  TILE_CARD_CLASS,
  TILE_DESC_CLASS,
  TILE_ICON_CLASS,
  TILE_TITLE_CLASS,
  VARIANT_BY_ID,
  badgeToneClass,
} from '../model/maps';
import type { TAdvantageTile, TAdvantageTileVariant } from '../model/types';

type TProps = {
  tile: TAdvantageTile;
  /** Visual variant. Defaults to the id-based lookup; can be overridden from the widget. */
  variant?: TAdvantageTileVariant;
  className?: string;
};

export const AdvantageTile = ({ tile, variant, className }: TProps) => {
  const resolvedVariant: TAdvantageTileVariant =
    variant ?? VARIANT_BY_ID[tile.id] ?? 'default';

  const icon = HEADER_ICON_BY_ID[tile.id];
  const isAnchor = resolvedVariant === 'anchor';

  return (
    <article
      className={cn(
        'card-hover relative flex h-full flex-col overflow-hidden rounded-card border p-6',
        TILE_CARD_CLASS[resolvedVariant],
        className,
      )}
    >
      {/* Badge */}
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

      {/* Icon badge */}
      {icon ? (
        <div
          className={cn(
            'grid h-10 w-10 place-items-center rounded-xl',
            TILE_ICON_CLASS[resolvedVariant],
          )}
        >
          {icon}
        </div>
      ) : null}

      {/* Title */}
      <h3
        className={cn(
          icon ? 'mt-4' : 'mt-0',
          'mb-2 text-xl font-bold',
          TILE_TITLE_CLASS[resolvedVariant],
        )}
      >
        {tile.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          'm-0 text-sm leading-relaxed',
          TILE_DESC_CLASS[resolvedVariant],
        )}
      >
        {tile.description}
      </p>

      {/* Anchor-only: decorative VoiceWave visual */}
      {isAnchor ? (
        <div className="mt-auto pt-6" aria-hidden="true">
          <VoiceWave className="h-12 w-full text-glow-emerald opacity-70" />
        </div>
      ) : null}
    </article>
  );
};
