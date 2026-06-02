'use client';

import { useReducedMotion, motion } from 'framer-motion';
import { CheckIcon, MicIcon } from '@/shared/ui';
import type { TPhoneFloatBubble } from '@/entities/phone-mockup';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  bubbles: TPhoneFloatBubble[];
};

const POSITIONS = ['absolute -left-7 top-32', 'absolute -right-6 bottom-15'] as const;
const ICON_BG = [
  'bg-gold-pale text-gold-mid',
  'bg-primary-pale text-primary-ink',
] as const;

/**
 * Fly-in resting rotations (degrees).
 * These are the EXACT values at which fly-in ends AND idle drift begins.
 * Keeping them identical guarantees zero jerk at the handoff point.
 *
 * Card 0 (left): tilted slightly counter-clockwise (-4°)
 * Card 1 (right): tilted slightly clockwise (+4°)
 */
const REST_ROTATE = [-4, 4] as const;

/**
 * Fly-in origins — cards start far off-screen to their respective sides
 * and rotate from a more extreme angle toward their resting angle.
 */
const FLY_IN_X = [-120, 120] as const;
const FLY_IN_ROTATE = [-18, 18] as const;

/**
 * Idle drift keyframe sequences.
 * Each array MUST start and end at REST_ROTATE[i] so:
 * - The fly-in (initial → keyframes[0]) arrives at the rest angle.
 * - The repeat loop restarts at keyframes[0] with no position jump.
 *
 * Card 0: oscillates between -4° and -7° and back
 * Card 1: oscillates between +4° and +7° and back
 */
const DRIFT_CONFIG = [
  { rotateKeyframes: [-4, -7, -4, -2, -4] as number[], duration: 5.2 },
  { rotateKeyframes: [4, 7, 4, 1, 4] as number[], duration: 6.1 },
] as const;

/**
 * translateZ depth for the cards so they float above the phone plane
 * during the 3-D tilt. Value mirrors --tilt-card-z token (40px).
 * Applied via framer-motion's `z` prop (not a CSS class) so it composes
 * correctly with framer-motion's own transform decomposition.
 */
const CARD_Z = 40;

/**
 * Decorative cards floating beside the phone frame.
 * On page load each card flies in from its side and lands at its resting
 * rotation, then drifts gently forever at that same angle — no snap.
 *
 * reduced-motion: cards appear at rest immediately, no drift.
 */
export const FloatingBubbleCards = ({ bubbles }: TProps) => {
  const shouldReduce = useReducedMotion();

  return (
    <>
      {bubbles.map((bubble, idx) => {
        const position = POSITIONS[idx] ?? POSITIONS[0];
        const bgClass = ICON_BG[idx] ?? ICON_BG[0];
        const Icon = idx === 0 ? MicIcon : CheckIcon;
        const restRotate = REST_ROTATE[idx] ?? 0;
        const drift = DRIFT_CONFIG[idx] ?? DRIFT_CONFIG[0];
        const flyInX = FLY_IN_X[idx] ?? FLY_IN_X[0];
        const flyInRotate = FLY_IN_ROTATE[idx] ?? FLY_IN_ROTATE[0];

        if (shouldReduce) {
          return (
            <motion.div
              key={bubble.title}
              className={cn(
                position,
                'z-20 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-(--shadow-mid)',
              )}
              /**
               * Static reduced-motion rest state.
               * z is still applied so the card lifts above the phone plane
               * visually during any parent tilt (though tilt itself is also
               * disabled by useTilt3d when reduced-motion is on).
               */
              style={{ rotate: restRotate, z: CARD_Z }}
            >
              <CardContent bubble={bubble} Icon={Icon} bgClass={bgClass} />
            </motion.div>
          );
        }

        return (
          <motion.div
            key={bubble.title}
            className={cn(
              position,
              'z-20 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-(--shadow-mid)',
            )}
            /**
             * z is constant — cards always float 40px above the phone plane in
             * the 3-D stage (framer-motion composes translateZ alongside rotateX/Y
             * without conflict).
             */
            style={{ z: CARD_Z }}
            /**
             * Initial state: off-screen to the side, rotated far, invisible, small.
             */
            initial={{
              x: flyInX,
              rotate: flyInRotate,
              opacity: 0,
              scale: 0.85,
            }}
            /**
             * Animate array:
             * - x / opacity / scale use spring for a natural fly-in.
             * - rotate uses keyframe array starting at REST_ROTATE[i] (== drift[0])
             *   so the animation sequence IS: fly from flyInRotate → drift[0],
             *   then loop drift[0] → drift[1] → ... → drift[n] → drift[0].
             *
             * No jerk guarantee: keyframes[0] == keyframes[last] == REST_ROTATE[i]
             * so the loop restart is a zero-delta jump.
             */
            animate={{
              x: 0,
              rotate: drift.rotateKeyframes,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              x: {
                type: 'spring',
                stiffness: 90,
                damping: 18,
                mass: 0.9,
                delay: 0.3 + idx * 0.15,
              },
              opacity: {
                duration: 0.4,
                delay: 0.3 + idx * 0.15,
                ease: 'easeOut',
              },
              scale: {
                type: 'spring',
                stiffness: 90,
                damping: 18,
                mass: 0.9,
                delay: 0.3 + idx * 0.15,
              },
              /**
               * Rotate uses a tween (not spring) so framer-motion animates
               * from `initial.rotate` (flyInRotate) through the keyframes array.
               * The first leg (flyInRotate → keyframes[0]) is the fly-in snap.
               * `repeat: Infinity, repeatType: 'loop'` then loops the keyframe
               * sequence starting at keyframes[0] (== REST_ROTATE[i]) forever.
               * Since keyframes[0] === keyframes[last], no position jump occurs
               * when the loop restarts.
               */
              rotate: {
                times: [0, 0.3, 0.55, 0.8, 1],
                duration: drift.duration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                delay: 0.3 + idx * 0.15,
              },
            }}
          >
            <CardContent bubble={bubble} Icon={Icon} bgClass={bgClass} />
          </motion.div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Internal sub-component — card body (shared between static + animated paths)
// ---------------------------------------------------------------------------

type TCardContentProps = {
  bubble: TPhoneFloatBubble;
  Icon: React.ComponentType<{ size?: number }>;
  bgClass: string;
};

const CardContent = ({ bubble, Icon, bgClass }: TCardContentProps) => (
  <>
    <span className={cn('grid h-7 w-7 flex-none place-items-center rounded-lg', bgClass)}>
      <Icon size={14} />
    </span>
    <div>
      <div className="text-13 font-bold">{bubble.title}</div>
      <div className="text-11-5 text-muted">{bubble.subtitle}</div>
    </div>
  </>
);
