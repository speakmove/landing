'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Forces an instant scroll to (0, 0) on every route change.
 *
 * Why this exists: globals.css sets `scroll-behavior: smooth` on <html>
 * so in-page anchor jumps (#faq, #pricing) animate nicely. The side
 * effect is that Next.js's automatic scroll-to-top after navigation
 * also animates, and the animation gets interrupted halfway through —
 * the visible viewport lands ~64px (header height) below the top
 * instead of at 0. This component skips the smooth animation on real
 * route changes by calling scrollTo with `behavior: 'instant'`.
 *
 * Skip the very first effect run — the initial page already loads at
 * its intended scroll position.
 */
export const ScrollToTopOnRouteChange = () => {
  const pathname = usePathname();
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};
