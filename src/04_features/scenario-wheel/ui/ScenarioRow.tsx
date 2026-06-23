'use client';

import { memo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { useWheelFocus } from '../model/hooks/useWheelFocus';
import { ScenarioRowContent } from './ScenarioRowContent';
import type { TScenarioRowProps } from '../model/types';

type TProps = TScenarioRowProps & {
  /** Shared scrollY MotionValue from ScenariosWheel (one per widget). */
  scrollY: MotionValue<number>;
  /** Shared rowHeight MotionValue from ScenariosWheel (one per widget). */
  rowHeight: MotionValue<number>;
  /** Zero-based row index within the rendered list. */
  index: number;
  /** Centre-slot index at scrollTop 0. */
  centerOffset: number;
  /**
   * True when this row is the active/centred row (green number).
   * Computed once per widget in ScenariosWheel on scroll-settle.
   */
  isActive: boolean;
};

/**
 * Single editorial scenario row — wheel variant.
 *
 * Receives shared MotionValues (scrollY, rowHeight) from ScenariosWheel and
 * derives its own transforms via useWheelFocus (pure deriver, no side effects).
 * The active-row highlight (green number) is driven by the `isActive` prop,
 * which ScenariosWheel computes from a single shared state.
 *
 * rotateX gives the iOS date-picker tilt; it requires:
 *  - `transform-style: preserve-3d` on this element (class `scenarios-wheel-row`)
 *  - `perspective` on the outer wrapper (class `scenarios-wheel-outer`)
 * Both classes live outside `@layer components` in globals.css.
 */
function ScenarioRowBase({
  number,
  title,
  aiRole,
  hook,
  duration,
  href,
  ariaLabel,
  scrollY,
  rowHeight,
  index,
  centerOffset,
  isActive,
}: TProps) {
  const { scale, opacity, rotateX } = useWheelFocus({
    scrollY,
    rowHeight,
    index,
    centerOffset,
  });

  return (
    <li className="scenarios-wheel-item list-none">
      {/*
       * framer-motion `style` with MotionValues is the approved exception to the
       * no-inline-style rule: these are reactive MotionValues, not static objects.
       */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="scenarios-wheel-row group flex h-full w-full flex-row items-center gap-4 border-b border-line py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-6 sm:py-5"
        style={{ scale, opacity, rotateX }}
      >
        <ScenarioRowContent
          number={number}
          title={title}
          aiRole={aiRole}
          hook={hook}
          duration={duration}
          isActive={isActive}
        />
      </motion.a>
    </li>
  );
}

/**
 * Memoized so a change of the parent's `activeIndex` re-renders only the two
 * rows whose `isActive` actually flips, not all rendered copies. All other
 * props (row data, shared MotionValues, index, centerOffset) are stable.
 */
export const ScenarioRow = memo(ScenarioRowBase);
