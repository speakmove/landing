/**
 * Safe URL handling for `href` attributes.
 *
 * Why: React does NOT sanitize URLs in href/src. A `javascript:` payload
 * in user-controlled or i18n-controlled data executes on click. The
 * defence is a protocol allow-list + the URL parser.
 *
 * Approach (per OWASP / Snyk / pragmaticwebsecurity guidance, 2025):
 *   1. Allow relative paths (`/`) and fragments (`#`) — they cannot
 *      carry a scheme.
 *   2. Parse absolute URLs with the WHATWG `URL` constructor (throws
 *      on garbage).
 *   3. Whitelist only `http:`, `https:`, `mailto:`, `tel:` protocols.
 *      Anything else (javascript:, data:, vbscript:, blob:, file:, …)
 *      is rejected, including case variants and whitespace-obfuscated
 *      forms — the parser normalises those for us.
 *
 * Pure browser API, no dependencies. CSP is the second line of defence;
 * client validation is for UX, server-side should re-validate for any
 * persisted href.
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Whether `href` is safe to put in an anchor's `href` attribute.
 * Accepts relative paths, fragments, and absolute URLs in the allow-list.
 */
export const isSafeHref = (href: unknown): href is string => {
  if (typeof href !== 'string') return false;
  const trimmed = href.trim();
  if (trimmed === '') return false;

  // Relative paths and fragments carry no scheme — safe by construction.
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
};

/**
 * Returns `href` when safe, otherwise `fallback` (default `'#'`).
 * Use at any render boundary where the href comes from outside-the-codebase
 * data (i18n JSON, CMS, query params, etc.).
 */
export const safeHrefOr = (href: unknown, fallback: string = '#'): string =>
  isSafeHref(href) ? href : fallback;

/**
 * True iff `href` is safe AND points outside the current origin —
 * i.e. an `http(s)://` URL, `mailto:` or `tel:` link. Relative paths
 * and fragments are treated as internal.
 *
 * Use to decide whether to render an external `<a target="_blank">` or
 * an internal `<Link>`.
 */
export const isExternalHref = (href: unknown): href is string => {
  if (!isSafeHref(href)) return false;
  // After `isSafeHref` we know it's a non-empty string.
  const trimmed = (href as string).trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return false;
  }
  // Absolute URL that passed allow-list — external by definition.
  return true;
};
