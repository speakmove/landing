type TTranslator = {
  has: (key: string) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: (key: string) => any;
};

/**
 * Safely read an array value from a next-intl namespace.
 *
 * Why: `t.raw('items') as T[]` throws or returns undefined when the key
 * is missing, and the next `.map()` crashes the whole server component
 * tree. A typo in messages/*.json should NOT take a page down — empty
 * array is the right default for a missing list.
 *
 * Usage:
 *   const items = getList<TFaqItem>(t, 'items');
 *   // items is always TFaqItem[] — possibly empty
 */
export const getList = <T,>(t: TTranslator, key: string): T[] => {
  if (!t.has(key)) return [];
  try {
    const raw = t.raw(key) as unknown;
    return Array.isArray(raw) ? (raw as T[]) : [];
  } catch {
    return [];
  }
};

/**
 * Safely read an object value from a next-intl namespace.
 * Returns `null` when the key is missing or the value isn't an object.
 */
export const getObject = <T,>(t: TTranslator, key: string): T | null => {
  if (!t.has(key)) return null;
  try {
    const raw = t.raw(key) as unknown;
    return raw && typeof raw === 'object' ? (raw as T) : null;
  } catch {
    return null;
  }
};
