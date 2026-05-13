import 'server-only';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  // Path is relative to this file. If you move this file, update the path
  // or migrate to a tsconfig alias.
  return {
    locale,
    messages: (await import(`../../../../../messages/${locale}.json`)).default,
  };
});
