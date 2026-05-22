'use client';

import { useSyncExternalStore } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { cn } from '@/shared/model/libs/cn';
import { usePhoneJourneyAnchor } from '../model/hooks/usePhoneJourneyAnchor';
import type { TPhoneJourneyRole } from '../model/types';

type TProps = {
  role: TPhoneJourneyRole;
  className?: string;
  /** Aspect-ratio mock (e.g. "9 / 19.5") for layout reserve via .phone-journey-anchor + --pj-aspect. */
  aspect?: string;
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

export const PhoneJourneyMount = ({ role, className, aspect }: TProps) => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ref = usePhoneJourneyAnchor(role);

  if (!isDesktop) return null;

  // CSS custom-property bridge: pass --pj-aspect through inline style and read it
  // from the .phone-journey-anchor class in globals.css. Avoids raw aspectRatio inline-style.
  const aspectStyle = aspect
    ? ({ ['--pj-aspect' as string]: aspect } as CSSProperties)
    : undefined;

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={cn(aspect && 'phone-journey-anchor', className)}
      aria-hidden="true"
      style={aspectStyle}
    />
  );
};
