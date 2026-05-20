import { URLS } from '@/shared/config';

/**
 * Build a Telegram bot deep-link with a `start` parameter.
 * Always encodes the topic id, so future ids containing `&`, `?`,
 * space, etc. cannot silently break the URL.
 */
export const buildBotStartUrl = (topicId: string): string =>
  `${URLS.telegramBot}?start=${encodeURIComponent(topicId)}`;
