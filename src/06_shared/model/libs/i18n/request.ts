import 'server-only';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const NAMESPACES = [
  'common',
  'languageSwitcher',
  'home',
  'howItWorks',
  'pricing',
  'waitlist',
  'privacy',
  'notFound',
  'error',
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Paths are relative to this file. If you move this file, update them
  // or migrate to a tsconfig alias.
  const modules = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const mod = await import(`../../../../../messages/${locale}/${namespace}.json`);
      return [namespace, mod.default] as const;
    }),
  );

  const messages = Object.fromEntries(modules);

  return { locale, messages };
});
