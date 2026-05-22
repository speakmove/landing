'use client';

import { useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PhoneMockup } from '@/entities/phone-mockup';
import { MOTION_DURATION, MOTION_EASE } from '@/shared/ui';
import { usePhoneJourneyContext } from '../model/store';
import { usePhoneJourneyScroll } from '../model/hooks/usePhoneJourneyScroll';

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

export const PhoneJourney = () => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const shouldReduce = useReducedMotion();
  const { activeContent } = usePhoneJourneyContext();
  const { x, y, scale, rotateY, visible } = usePhoneJourneyScroll();

  if (!isDesktop || !activeContent) return null;

  // CSS custom-property bridge: --pj-x / --pj-y carry scroll-derived positions
  // into the CSS layer. Same pattern as Phase 2's --accent-delay.
  const layerStyle = {
    ['--pj-x' as string]: `${x}px`,
    ['--pj-y' as string]: `${y}px`,
  } as CSSProperties;

  // Framer-motion → DOM bridge: transform + opacity are derived from scroll state
  // each frame; inline-style is the only sensible channel for per-frame transform.
  const stageStyle: CSSProperties | undefined = shouldReduce
    ? undefined
    : ({
        transform: `translate3d(calc(var(--pj-x) - 50%), calc(var(--pj-y) - 50%), 0) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity: visible ? 1 : 0,
      } as CSSProperties);

  return (
    <div className="phone-journey-layer" aria-hidden="true" style={layerStyle}>
      <motion.div className="phone-journey-stage" style={stageStyle}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeContent.botName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduce ? 0 : MOTION_DURATION.base,
              ease: MOTION_EASE.out,
            }}
          >
            <PhoneMockup
              botName={activeContent.botName}
              botStatus="online"
              dateLabel="Today"
              inputPlaceholder="Message…"
              micLabel="Voice message"
              messages={activeContent.messages}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
