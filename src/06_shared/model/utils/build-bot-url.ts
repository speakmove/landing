import { URLS } from '@/shared/config';

/**
 * Build a Telegram bot link with locale and optional topic as query params.
 *
 * Examples: `?lang=ru`, `?lang=uk&topic=landlord`.
 */
export const buildBotUrl = (locale: string, topicId?: string): string => {
  const params = new URLSearchParams({ lang: locale });
  if (topicId) params.set('topic', topicId);
  return `${URLS.telegramBot}?${params.toString()}`;
};
