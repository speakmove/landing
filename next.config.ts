import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/06_shared/model/libs/i18n/request.ts');

/**
 * Content Security Policy.
 *
 * - `default-src 'self'`: same-origin only by default.
 * - `script-src` and `style-src` allow 'unsafe-inline' because Next.js
 *   App Router emits inline scripts/styles for hydration, font loading
 *   and Tailwind v4 utility CSS. A future nonce-based version (via
 *   middleware) would tighten this further, but for an SSG marketing
 *   surface with no client mutation surface 'unsafe-inline' is the
 *   pragmatic V0 setting.
 * - `img-src` allows data: (Next/Image placeholders) and https: for
 *   future remote OG/social images.
 * - `font-src 'self' data:` covers next/font (locally served) and the
 *   data-URL fallbacks JetBrains Mono / Inter occasionally emit.
 * - `connect-src 'self'` — no external API calls on the marketing
 *   surface. Add hosts here when Stripe/analytics are wired up.
 * - `frame-ancestors 'none'` — site cannot be embedded (clickjacking).
 * - `form-action 'self'` — forms can only submit back to our domain.
 * - `base-uri 'self'` — prevents <base> injection from changing the
 *   resolution of relative URLs.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
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
        ],
      },
    ];
  },
};

export default withNextIntl(config);
