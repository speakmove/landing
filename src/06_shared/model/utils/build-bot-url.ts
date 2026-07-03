import { URLS } from '@/shared/config';

/**
 * Build a Telegram bot deep-link.
 *
 * The `start` payload encodes `key-value` pairs joined by `_` (Telegram allows
 * only `[A-Za-z0-9_]`, so keys/values must already conform). The bot only acts
 * on `lang` (sets greeting language); `src` and `topic` are stored verbatim in
 * the `source` column for attribution and are not parsed further.
 *
 * Example: `?start=lang-ru_src-landing-hero_topic-landlord`.
 */
export const buildBotUrl = (locale: string, src: string, topicId?: string): string => {
  const pairs = [`lang-${locale}`, `src-${src}`];
  if (topicId) pairs.push(`topic-${topicId}`);
  return `${URLS.telegramBot}?start=${encodeURIComponent(pairs.join('_'))}`;
};
