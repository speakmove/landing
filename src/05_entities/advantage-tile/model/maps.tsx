import type { ReactNode } from 'react';
import {
  MapPinIcon,
  MessageCircleIcon,
  MicIcon,
  ShieldIcon,
  TelegramIcon,
} from '@/shared/ui';
import type { TAdvantageTileVariant } from './types';

export const HEADER_ICON_BY_ID: Record<string, ReactNode> = {
  voice: <MicIcon size={20} />,
  'uk-scenarios': <MapPinIcon size={20} />,
  'native-feedback': <MessageCircleIcon size={20} />,
  'in-telegram': <TelegramIcon size={20} />,
  'honest-pricing': <ShieldIcon size={20} />,
};

export const HEADER_TONE_BY_ID: Record<string, string> = {
  voice: 'bg-primary text-white',
  'uk-scenarios': 'bg-primary-pale text-primary',
  'native-feedback': 'bg-primary-pale text-primary',
  'in-telegram': 'bg-primary-pale text-primary',
  'honest-pricing': 'bg-gold-accent text-ink',
};

/** Maps tile id → visual variant. */
export const VARIANT_BY_ID: Record<string, TAdvantageTileVariant> = {
  voice: 'anchor',
  'honest-pricing': 'gold',
  'uk-scenarios': 'default',
  'native-feedback': 'default',
  'in-telegram': 'default',
};

/** Article bg / border / text styles per variant. */
export const TILE_CARD_CLASS: Record<TAdvantageTileVariant, string> = {
  anchor:
    'bg-primary-ink text-white border-transparent shadow-(--shadow-deep)',
  // "Price" tile — white like the rest; gold lives only in the icon accent.
  gold: 'bg-white border-line text-ink shadow-(--shadow-soft)',
  default: 'bg-white border-line text-ink shadow-(--shadow-soft)',
};

/** Icon badge bg/text per variant. */
export const TILE_ICON_CLASS: Record<TAdvantageTileVariant, string> = {
  anchor: 'bg-primary text-white',
  // Price tile icon matches the other tiles (emerald) — no gold accent.
  gold: 'bg-primary-pale text-primary',
  default: 'bg-primary-pale text-primary',
};

/** Title colour per variant. */
export const TILE_TITLE_CLASS: Record<TAdvantageTileVariant, string> = {
  anchor: 'text-white',
  gold: 'text-ink',
  default: 'text-ink',
};

/** Description colour per variant. */
export const TILE_DESC_CLASS: Record<TAdvantageTileVariant, string> = {
  anchor: 'text-primary-pale',
  gold: 'text-muted',
  default: 'text-muted',
};

const BADGE_TONE_BY_KIND: Record<string, string> = {
  'coming-soon': 'bg-primary-pale text-primary-ink',
  new: 'bg-gold-accent text-ink',
  feature: 'bg-gold-accent text-ink',
};
const DEFAULT_BADGE_TONE = 'bg-gold-accent text-ink';

export const badgeToneClass = (kind: string | undefined): string =>
  (kind && BADGE_TONE_BY_KIND[kind]) ?? DEFAULT_BADGE_TONE;
