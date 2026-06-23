'use client';

import { useEffect, useState } from 'react';

/** Hide the blur this many px before the page bottom (don't cover footer/CTA). */
const END_GAP = 120;

/**
 * Tracks whether the bottom scroll-blur strip should be visible:
 *  - hidden on short pages (document not taller than the viewport);
 *  - hidden within `END_GAP`px of the page bottom (so it never covers the
 *    footer / final CTA);
 *  - visible otherwise (mid-scroll on a long page).
 *
 * `enabled = false` (e.g. reduced-motion) → always hidden, no listeners.
 */
export const useNearPageEnd = (enabled: boolean): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      // Defer to rAF so we don't call setState synchronously inside the effect.
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }

    const compute = () => {
      const doc = document.documentElement;
      const scrollH = doc.scrollHeight;
      const viewH = window.innerHeight;
      const hasScroll = scrollH > viewH + 4;
      const distanceToEnd = scrollH - (window.scrollY + viewH);
      setVisible(hasScroll && distanceToEnd > END_GAP);
    };

    // Initial compute deferred to rAF (avoid synchronous setState in effect).
    const initialRaf = requestAnimationFrame(compute);
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      cancelAnimationFrame(initialRaf);
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [enabled]);

  return visible;
};
