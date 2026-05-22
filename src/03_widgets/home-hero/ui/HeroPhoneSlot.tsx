'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { PhoneJourneyMount, usePhoneJourneyContext } from '@/widgets/phone-journey';
import type { TPhoneMessage } from '@/entities/phone-mockup';

type TProps = {
  inlineMobile: ReactNode;
  desktopContent: {
    botName: string;
    messages: TPhoneMessage[];
  };
};

const subscribe = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(min-width: 1024px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
};

const getServerSnapshot = () => false;

export const HeroPhoneSlot = ({ inlineMobile, desktopContent }: TProps) => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { setActiveContent } = usePhoneJourneyContext();

  useEffect(() => {
    if (!isDesktop) return;
    setActiveContent(desktopContent);
    return () => setActiveContent(null);
  }, [isDesktop, desktopContent, setActiveContent]);

  if (!isDesktop) return <>{inlineMobile}</>;

  return (
    <PhoneJourneyMount
      role="source"
      className="phone-preview-wrap phone-preview-wrap--compact"
      aspect="9 / 19.5"
    />
  );
};
