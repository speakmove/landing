'use client';

import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import Lenis from 'lenis';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const readHeaderHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 64;
};

export const LenisProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    const isReduced = window.matchMedia(REDUCED_QUERY).matches;
    if (!isDesktop || isReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = -readHeaderHeight();
      lenis.scrollTo(el, { offset });
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
