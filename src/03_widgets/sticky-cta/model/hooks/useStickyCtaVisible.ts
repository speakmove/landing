'use client';

import { useEffect, useState } from 'react';

/** Don't show until the user has scrolled past roughly one viewport (the hero). */
const SHOW_AFTER_RATIO = 0.8;
/** Hide this many px before the page bottom so it never covers the final CTA. */
const END_GAP = 280;

/**
 * Tracks whether the sticky bottom CTA bar should be visible:
 *  - hidden near the top (still inside/just past the hero, where the
 *    in-hero CTA is already on screen);
 *  - hidden within `END_GAP`px of the page bottom (the page's own
 *    FinalCtaSection takes over there);
 *  - visible otherwise.
 */
export const useStickyCtaVisible = (): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const scrollH = doc.scrollHeight;
      const viewH = window.innerHeight;
      const scrollY = window.scrollY;

      const pastHero = scrollY > viewH * SHOW_AFTER_RATIO;
      const distanceToEnd = scrollH - (scrollY + viewH);
      setVisible(pastHero && distanceToEnd > END_GAP);
    };

    const initialRaf = requestAnimationFrame(compute);
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      cancelAnimationFrame(initialRaf);
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return visible;
};
