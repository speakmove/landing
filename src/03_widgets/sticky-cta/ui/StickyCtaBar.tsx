'use client';

import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/shared/ui';
import { useStickyCtaVisible } from '../model/hooks/useStickyCtaVisible';

type TProps = {
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Fixed bottom CTA bar for long pages. Fades in once the user has scrolled
 * past the hero (where the primary CTA already lives) and fades out again
 * near the page bottom so it never overlaps the page's own FinalCtaSection.
 *
 * Publishes its own rendered height to `--sticky-cta-height` on `<html>` so
 * the unrelated `scroll-blur` widget can lift its strip above the bar
 * instead of being covered by it (see `.scroll-blur` in globals.css).
 */
export const StickyCtaBar = ({ ctaLabel, ctaHref }: TProps) => {
  const visible = useStickyCtaVisible();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty('--sticky-cta-height', '0px');
      return;
    }
    const el = barRef.current;
    if (!el) return;
    root.style.setProperty('--sticky-cta-height', `${el.offsetHeight * 0.75}px`);
  }, [visible]);

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className="sticky-cta-bar fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-line/80 bg-white/90 px-5 py-3 shadow-(--shadow-deep) backdrop-blur-xl backdrop-saturate-150 md:hidden"
      data-visible={visible}
    >
      <ButtonLink href={ctaHref} variant="primary" size="md" className="w-full max-w-100" tabIndex={visible ? 0 : -1}>
        {ctaLabel}
      </ButtonLink>
    </div>
  );
};
