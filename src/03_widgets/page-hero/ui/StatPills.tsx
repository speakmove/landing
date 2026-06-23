'use client';

import { motion, useReducedMotion } from 'framer-motion';

type TStat = {
  value: string;
  label: string;
};

type TProps = {
  stats: TStat[];
  ariaLabel: string;
};

/**
 * Resting tilt per pill (degrees), alternating sign so the trio reads as a
 * loosely scattered set of floating badges rather than a rigid row. These
 * angles are the EXACT targets at which fly-in ends AND idle drift begins —
 * keeping fly-in target === drift keyframes[0] guarantees zero jerk at the
 * handoff (same trick as TrustPills / FloatingBubbleCards).
 *
 * Pill 0: -2°   Pill 1: +1.5°   Pill 2: -1.5°
 */
const REST_ROTATE = [-2, 1.5, -1.5] as const;

/**
 * Fly-in origins — each pill arrives from a DIFFERENT direction:
 * pill 0 from the left, pill 1 from the top, pill 2 from the right.
 * Each converges to its slot (x:0, y:0).
 */
const FLY_IN_OFFSET = [
  { x: -88, y: 0 }, // left
  { x: 0, y: -60 }, // top
  { x: 88, y: 0 }, // right
] as const;
const FLY_IN_ROTATE = [-10, 10, -10] as const;

/**
 * Idle drift keyframe sequences. Each array MUST start and end at
 * REST_ROTATE[i] so the fly-in (initial → keyframes[0]) lands on the rest
 * angle and the repeat loop restarts with no angle jump. Amplitude is tiny
 * (≈±1.2° around rest); periods are long + mutually prime-ish so the three
 * pills never visibly sync up.
 */
const DRIFT_CONFIG = [
  { rotateKeyframes: [-2, -3.1, -2, -1, -2] as number[], duration: 7.8 },
  { rotateKeyframes: [1.5, 2.7, 1.5, 0.5, 1.5] as number[], duration: 8.9 },
  { rotateKeyframes: [-1.5, -2.6, -1.5, -0.5, -1.5] as number[], duration: 8.3 },
] as const;

/** Per-pill stagger so they settle one-by-one when the row enters view. */
const STAGGER = 0.12;

const PILL_CLASS =
  'inline-flex flex-col items-center rounded-card border border-line bg-white px-5 py-3 text-center shadow-(--shadow-soft)';

/**
 * Floating stat pills (client island).
 *
 * On scroll-into-view (`whileInView`, `once: true`) each pill flies in from
 * its own direction into its resting tilt, staggered one after another, then
 * drifts forever with a very subtle angle oscillation. Fly-in target angle
 * equals drift keyframes[0] (== keyframes[last]), so neither the fly-in→drift
 * handoff nor the loop restart produces a jerk.
 *
 * reduced-motion: pills render statically at their resting tilt — no fly-in,
 * no drift.
 */
export const StatPills = ({ stats, ariaLabel }: TProps) => {
  const shouldReduce = useReducedMotion();

  return (
    <ul
      className="mx-auto mt-7 flex w-full max-w-2xl list-none flex-wrap justify-center gap-x-6 gap-y-4 p-0 sm:gap-x-8"
      aria-label={ariaLabel}
    >
      {stats.map((stat, idx) => {
        const restRotate = REST_ROTATE[idx] ?? 0;
        const drift = DRIFT_CONFIG[idx] ?? DRIFT_CONFIG[0];
        const flyInOffset = FLY_IN_OFFSET[idx] ?? FLY_IN_OFFSET[0];
        const flyInRotate = FLY_IN_ROTATE[idx] ?? FLY_IN_ROTATE[0];
        const delay = idx * STAGGER;

        const body = (
          <>
            <span className="font-mono text-2xl font-extrabold tracking-[-0.01em] text-primary-ink">
              {stat.value}
            </span>
            <span className="mt-1 text-13 text-muted">{stat.label}</span>
          </>
        );

        if (shouldReduce) {
          return (
            <motion.li
              key={stat.label}
              className={PILL_CLASS}
              /** Static reduced-motion rest state — decorative tilt only. */
              style={{ rotate: restRotate }}
            >
              {body}
            </motion.li>
          );
        }

        return (
          <motion.li
            key={stat.label}
            className={PILL_CLASS}
            initial={{
              x: flyInOffset.x,
              y: flyInOffset.y,
              rotate: flyInRotate,
              opacity: 0,
              scale: 0.85,
            }}
            /**
             * whileInView fly-in: pill flies in from its own direction (x/y) to
             * its slot. rotate animates through the drift keyframe array, whose
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
            {body}
          </motion.li>
        );
      })}
    </ul>
  );
};
