import type { ReactNode } from 'react';
import {
  MapPinIcon,
  MessageCircleIcon,
  MicIcon,
  ShieldIcon,
  TelegramIcon,
} from '@/shared/ui';

export const HEADER_ICON_BY_ID: Record<string, ReactNode> = {
  voice: <MicIcon size={20} />,
  'uk-scenarios': <MapPinIcon size={20} />,
  'native-feedback': <MessageCircleIcon size={20} />,
  'in-telegram': <TelegramIcon size={20} />,
  'honest-pricing': <ShieldIcon size={20} />,
};

export const HEADER_TONE_BY_ID: Record<string, string> = {
  voice: 'bg-primary-pale text-primary',
  'uk-scenarios': 'bg-primary-pale text-primary',
  'native-feedback': 'bg-primary-pale text-primary',
  'in-telegram': 'bg-primary-pale text-primary',
  'honest-pricing': 'bg-primary-pale text-primary',
};

const BADGE_TONE_BY_KIND: Record<string, string> = {
  'coming-soon': 'bg-primary-pale text-primary-ink',
  new: 'bg-gold-accent text-ink',
  feature: 'bg-gold-accent text-ink',
};
const DEFAULT_BADGE_TONE = 'bg-gold-accent text-ink';

export const badgeToneClass = (kind: string | undefined): string =>
  (kind && BADGE_TONE_BY_KIND[kind]) ?? DEFAULT_BADGE_TONE;
