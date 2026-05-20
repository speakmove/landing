import type { ReactNode } from 'react';
import {
  BarChartIcon,
  CheckIcon,
  CoinIcon,
  DocumentIcon,
  MapPinIcon,
  MessageCircleIcon,
  MicIcon,
  ShieldIcon,
  TelegramIcon,
} from '@/shared/ui';
import {
  CefrProgressBars,
  CertificateMedal,
  CoinExchangeVisual,
  HomeworkItemList,
  VoiceBarChart,
} from '../ui/visuals';
import type { TAdvantageTile } from './types';

/**
 * Icon shown in the tile header by tile id. Tiles without an entry
 * render with no icon container (header collapses).
 */
export const HEADER_ICON_BY_ID: Record<string, ReactNode> = {
  voice: <MicIcon size={20} />,
  'uk-scenarios': <MapPinIcon size={20} />,
  'native-feedback': <MessageCircleIcon size={20} />,
  'in-telegram': <TelegramIcon size={20} />,
  'honest-pricing': <ShieldIcon size={20} />,
  coins: <CoinIcon size={20} />,
  cefr: <BarChartIcon size={20} />,
  homework: <DocumentIcon size={20} />,
  certificate: <CheckIcon size={20} />,
};

/** Tone (background + foreground) for the header-icon container by id. */
export const HEADER_TONE_BY_ID: Record<string, string> = {
  voice: 'bg-primary-pale text-primary',
  'uk-scenarios': 'bg-primary-pale text-primary',
  'native-feedback': 'bg-primary-pale text-primary',
  'in-telegram': 'bg-primary-pale text-primary',
  'honest-pricing': 'bg-primary-pale text-primary',
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

export const badgeToneClass = (kind: string | undefined): string =>
  (kind && BADGE_TONE_BY_KIND[kind]) ?? DEFAULT_BADGE_TONE;

type TVisualRenderer = (tile: TAdvantageTile) => ReactNode;

/** In-tile visual extension, rendered below the description by tile id. */
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

export const renderTileVisual = (tile: TAdvantageTile): ReactNode =>
  VISUALS_BY_ID[tile.id]?.(tile) ?? null;
