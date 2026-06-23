'use client';

import { useReducedMotion, motion } from 'framer-motion';
import { CheckIcon } from '@/shared/ui';

type TProps = {
  items: string[];
};

/**
 * Resting tilt per pill (degrees), alternating sign so the row reads as a
 * loosely scattered set of floating badges rather than a rigid line.
 * These are the EXACT angles at which fly-in ends AND idle drift begins —
 * keeping fly-in target === drift keyframes[0] guarantees zero jerk at the
 * handoff point (same trick as FloatingBubbleCards).
 *
 * Pill 0: -1.5°   Pill 1: +2°   Pill 2: -2°   Pill 3: +1.5°
 */
const REST_ROTATE = [-1.5, 2, -2, 1.5] as const;

/**
 * Fly-in origins — each pill arrives from a DIFFERENT direction:
 * pill 0 from the left, pill 1 from the top, pill 2 from the bottom,
 * pill 3 from the right. Each converges to its slot (x:0, y:0).
 */
const FLY_IN_OFFSET = [
  { x: -90, y: 0 }, // left
  { x: 0, y: -64 }, // top
  { x: 0, y: 64 }, // bottom
  { x: 90, y: 0 }, // right
] as const;
const FLY_IN_ROTATE = [-10, 10, -10, 10] as const;

/**
 * Idle drift keyframe sequences.
 * Each array MUST start and end at REST_ROTATE[i] so:
 * - The fly-in (initial → keyframes[0]) arrives at the rest angle.
 * - The repeat loop restarts at keyframes[0] with no angle jump.
 *
 * Amplitude is deliberately tiny (≈±1.2° around rest) and the periods are
 * long + mutually prime-ish so the four pills never visibly sync up.
 */
const DRIFT_CONFIG = [
  { rotateKeyframes: [-1.5, -2.7, -1.5, -0.5, -1.5] as number[], duration: 7.4 },
  { rotateKeyframes: [2, 3.1, 2, 1, 2] as number[], duration: 8.6 },
  { rotateKeyframes: [-2, -3.1, -2, -1, -2] as number[], duration: 8.1 },
  { rotateKeyframes: [1.5, 2.7, 1.5, 0.5, 1.5] as number[], duration: 9.2 },
] as const;

/** Per-pill stagger so they settle one-by-one when the row enters view. */
const STAGGER = 0.12;

/**
 * Floating trust pills (client island).
 *
 * On scroll-into-view (`whileInView`, `once: true`) each pill rises into its
 * resting tilt, staggered one after another, then drifts forever with a very
 * subtle angle oscillation. The fly-in target angle equals drift keyframes[0]
 * (== keyframes[last]), so neither the fly-in→drift handoff nor the loop
 * restart produces a jerk.
 *
 * reduced-motion: pills render statically at their resting tilt — no rise,
 * no drift.
 */
export const TrustPills = ({ items }: TProps) => {
  const shouldReduce = useReducedMotion();

  return (
    <>
      {items.map((item, idx) => {
        const restRotate = REST_ROTATE[idx] ?? 0;
        const drift = DRIFT_CONFIG[idx] ?? DRIFT_CONFIG[0];
        const flyInOffset = FLY_IN_OFFSET[idx] ?? FLY_IN_OFFSET[0];
        const flyInRotate = FLY_IN_ROTATE[idx] ?? FLY_IN_ROTATE[0];
        const delay = idx * STAGGER;

        if (shouldReduce) {
          return (
            <motion.li
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-13 font-medium text-ink shadow-(--shadow-soft)"
              /** Static reduced-motion rest state — decorative tilt only. */
              style={{ rotate: restRotate }}
            >
              <CheckIcon size={14} strokeWidth={3} className="shrink-0 text-primary" />
              {item}
            </motion.li>
          );
        }

        return (
          <motion.li
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-13 font-medium text-ink shadow-(--shadow-soft)"
            initial={{
              x: flyInOffset.x,
              y: flyInOffset.y,
              rotate: flyInRotate,
              opacity: 0,
              scale: 0.85,
            }}
            /**
             * whileInView fly-in: pill flies in from its own direction (x/y) to
             * its slot. rotate animates to the drift keyframe array, whose
             * first/last entry === restRotate, so it lands exactly on the rest
             * angle and the subsequent infinite loop never jumps.
             */
            whileInView={{
              x: 0,
              y: 0,
              rotate: drift.rotateKeyframes,
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              x: { type: 'spring', stiffness: 90, damping: 18, mass: 0.9, delay },
              y: { type: 'spring', stiffness: 90, damping: 18, mass: 0.9, delay },
              opacity: { duration: 0.4, ease: 'easeOut', delay },
              scale: { type: 'spring', stiffness: 90, damping: 18, mass: 0.9, delay },
              /**
               * rotate: tween so framer animates initial.rotate (flyInRotate)
               * through the keyframe array. First leg = fly-in snap into rest;
               * then loops the drift sequence forever. keyframes[0] ==
               * keyframes[last] == restRotate ⇒ zero-delta loop restart.
               */
              rotate: {
                times: [0, 0.3, 0.55, 0.8, 1],
                duration: drift.duration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                delay,
              },
            }}
          >
            <CheckIcon size={14} strokeWidth={3} className="shrink-0 text-primary" />
            {item}
          </motion.li>
        );
      })}
    </>
  );
};
