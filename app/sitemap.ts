import type { MetadataRoute } from 'next';
import { routing } from '@/shared/model/libs/i18n/routing';
import { env } from '@/shared/model/libs/env';

const PATHS = [
  '',
  '/how-it-works',
  '/pricing',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!env.NEXT_PUBLIC_INDEXABLE) return [];

  const base = env.NEXT_PUBLIC_SITE_URL;
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}/${l}${path}`]),
        ),
      },
    })),
  );
}
