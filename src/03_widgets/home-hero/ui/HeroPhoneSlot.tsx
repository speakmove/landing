'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { PhoneJourneyMount, useIsDesktop, usePhoneJourneyContext } from '@/widgets/phone-journey';
import type { TPhoneMessage } from '@/entities/phone-mockup';

type TProps = {
  inlineMobile: ReactNode;
  desktopContent: {
    botName: string;
    messages: TPhoneMessage[];
  };
};

export const HeroPhoneSlot = ({ inlineMobile, desktopContent }: TProps) => {
  const isDesktop = useIsDesktop();
  const { setActiveContent } = usePhoneJourneyContext();
  const sentinelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isDesktop) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActiveContent(desktopContent);
        }
        // On leave: do nothing — scenarios will claim ownership when it enters.
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isDesktop, desktopContent, setActiveContent]);

  if (!isDesktop) return <>{inlineMobile}</>;

  return (
    <div className="relative">
      <PhoneJourneyMount
        role="source"
        className="phone-preview-wrap phone-preview-wrap--compact"
        aspect="9 / 19.5"
      />
      {/* Visibility sentinel: overlays anchor so IO fires when source enters/exits viewport */}
      <span ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
    </div>
  );
};
