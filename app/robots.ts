import type { MetadataRoute } from 'next';
import { env } from '@/shared/model/libs/env';

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL;

  if (!env.NEXT_PUBLIC_INDEXABLE) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  };
}
