/**
 * Returns true if `href` points to a different origin or to a mailto:/tel: URL.
 * Internal app routes (starting with "/") return false.
 */
export const isExternal = (href: string): boolean => {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
};
