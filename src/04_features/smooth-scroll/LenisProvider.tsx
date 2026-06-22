'use client';

import { useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import Lenis from 'lenis';
import { usePathname } from '@/shared/model/libs/i18n/navigation';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const readHeaderHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 64;
};

export const LenisProvider = ({ children }: PropsWithChildren) => {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // MQ state is sampled once at mount. Resize/reduced-motion changes mid-session do
    // not toggle Lenis — acceptable for a landing page.
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    const isReduced = window.matchMedia(REDUCED_QUERY).matches;
    if (!isDesktop || isReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

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
      lenisRef.current = null;
    };
  }, []);

  // On cross-page navigation jump to the top INSTANTLY (no smooth scroll-up).
  // Lenis would otherwise ease the scroll-reset; force an immediate jump.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
};
