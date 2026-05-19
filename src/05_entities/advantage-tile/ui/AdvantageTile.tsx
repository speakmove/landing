import type { ReactNode } from 'react';
import { cn } from '@/shared/model/libs/cn';
import {
  CheckIcon,
  CoinIcon,
  Icon,
  MicIcon,
} from '@/shared/ui';
import type { TAdvantageTile } from '../model/types';
import {
  CefrProgressBars,
  CertificateMedal,
  CoinExchangeVisual,
  HomeworkItemList,
  VoiceBarChart,
} from './visuals';

type TProps = {
  tile: TAdvantageTile;
  className?: string;
};

const HEADER_ICON_BY_ID: Record<string, ReactNode> = {
  voice: <MicIcon size={20} />,
  coins: <CoinIcon size={20} />,
  cefr: (
    <Icon size={20} strokeWidth={2}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </Icon>
  ),
  homework: (
    <Icon size={20} strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </Icon>
  ),
  certificate: <CheckIcon size={20} />,
};

const HEADER_TONE_BY_ID: Record<string, string> = {
  voice: 'bg-primary-pale text-primary',
  coins: 'bg-gold-pale text-gold',
  cefr: 'bg-primary-pale text-primary',
  homework: 'bg-gold-pale text-gold',
  certificate: 'bg-primary-pale text-primary',
};

const BADGE_TONE_BY_KIND: Record<string, string> = {
  'coming-soon': 'bg-primary-pale text-primary-ink',
  new: 'bg-gold-accent text-ink',
  feature: 'bg-gold-accent text-ink',
};
const DEFAULT_BADGE_TONE = 'bg-gold-accent text-ink';

const badgeToneClass = (kind: string | undefined): string =>
  (kind && BADGE_TONE_BY_KIND[kind]) ?? DEFAULT_BADGE_TONE;

type TVisualRenderer = (tile: TAdvantageTile) => ReactNode;

const VISUALS_BY_ID: Record<string, TVisualRenderer> = {
  voice: () => <VoiceBarChart />,
  coins: (tile) => <CoinExchangeVisual vizEquals={tile.vizEquals} vizCap={tile.vizCap} />,
  cefr: (tile) =>
    tile.levels && tile.levels.length > 0 ? (
      <CefrProgressBars levels={tile.levels} currentLevel={tile.currentLevel} />
    ) : null,
  homework: (tile) =>
    tile.items && tile.items.length > 0 ? <HomeworkItemList items={tile.items} /> : null,
  certificate: (tile) =>
    tile.certificateName ? (
      <CertificateMedal
        certificateName={tile.certificateName}
        certificateStatus={tile.certificateStatus}
        currentLevel={tile.currentLevel}
      />
    ) : null,
};

const renderVisual = (tile: TAdvantageTile): ReactNode =>
  VISUALS_BY_ID[tile.id]?.(tile) ?? null;

/**
 * Bento-grid advantage tile. Renders a shared header (icon + title + description + optional badge)
 * and delegates the in-tile visual to a per-id component from `./visuals`.
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
        <div className={cn('grid h-10 w-10 place-items-center rounded-xl', tone)}>{icon}</div>
      ) : null}

      <h3 className={cn(icon ? 'mt-4' : 'mt-0', 'mb-2 text-xl font-bold text-ink')}>{tile.title}</h3>
      <p className="m-0 text-sm leading-relaxed text-muted">{tile.description}</p>

      {renderVisual(tile)}
    </article>
  );
};
