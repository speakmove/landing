import { env } from '@/shared/model/libs/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/06_shared/model/libs/i18n/request.ts');

const isDev = env.NODE_ENV !== 'production';
const isIndexable = env.NEXT_PUBLIC_INDEXABLE;

if (!isIndexable) {
  // Printed on every `next build`/`next dev` so a missing env var on a
  // production deploy is visible in the build log, not just discovered
  // later as "site isn't indexing and nobody knows why".
  console.warn(
    '\n⚠️  NEXT_PUBLIC_INDEXABLE is not "true" — this build ships noindex/nofollow headers, an empty sitemap.xml and a disallow-all robots.txt.\n   If this is the production deploy, set NEXT_PUBLIC_INDEXABLE=true before building.\n',
  );
}

/**
 * Content Security Policy.
 *
 * Dev-mode caveat: React Refresh + Next.js HMR need code-eval at
 * development time. The `unsafe-eval` keyword is appended to
 * script-src ONLY when NODE_ENV !== 'production'. Production builds
 * never see it.
 *
 * - `default-src 'self'`: same-origin only by default.
 * - `script-src 'unsafe-inline'`: Next.js App Router emits inline
 *   bootstrap/hydration scripts. A nonce-based variant via middleware
 *   would tighten this further; pragmatic V0 setting for an SSG surface.
 * - `style-src 'unsafe-inline'`: Tailwind v4 utility CSS + next/font.
 * - `connect-src 'self'` (+ ws: in dev for Fast Refresh).
 * - `frame-ancestors 'none'`, `form-action 'self'`, `base-uri 'self'`,
 *   `object-src 'none'` — standard clickjacking + injection hardening.
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: http://localhost:*' : ''}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

const config: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(isIndexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
    ];
  },
};

export default withNextIntl(config);
