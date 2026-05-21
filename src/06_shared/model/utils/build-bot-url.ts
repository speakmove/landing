import { URLS } from '@/shared/config';

/**
 * Build a Telegram bot deep-link.
 *
 * The `start` payload encodes locale and optional topic id, separated by `_`
 * (Telegram allows only `[A-Za-z0-9_]` in start payloads, so locale codes like
 * `ru`/`uk`/`en` and topic ids must already conform). The bot parses the payload
 * on first `/start` to set the user's language and jump straight into the topic.
 *
 * Examples: `?start=lang_ru`, `?start=lang_uk_landlord`.
 */
export const buildBotUrl = (locale: string, topicId?: string): string => {
  const parts = ['lang', locale];
  if (topicId) parts.push(topicId);
  return `${URLS.telegramBot}?start=${encodeURIComponent(parts.join('_'))}`;
};
