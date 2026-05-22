'use client';

import type { CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PhoneMockup } from '@/entities/phone-mockup';
import { MOTION_DURATION, MOTION_EASE } from '@/shared/ui';
import { usePhoneJourneyContext } from '../model/store';
import { usePhoneJourneyScroll } from '../model/hooks/usePhoneJourneyScroll';
import { useIsDesktop } from '../model/hooks/useIsDesktop';

export const PhoneJourney = () => {
  const isDesktop = useIsDesktop();
  const shouldReduce = useReducedMotion();
  const { activeContent } = usePhoneJourneyContext();
  const { x, y, scale, rotateY, visible } = usePhoneJourneyScroll();

  // Reduced-motion: skip the fixed-layer phone entirely. Without transform,
  // .phone-journey-stage would render stuck at top-left of the viewport.
  if (!isDesktop || !activeContent || shouldReduce) return null;

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
