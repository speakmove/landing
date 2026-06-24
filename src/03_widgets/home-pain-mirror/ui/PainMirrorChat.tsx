'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { DoubleCheckIcon } from '@/shared/ui';
import { MOTION_EASE, DUR_REVEAL } from '@/shared/ui/motion/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

type TLine = {
  text: string;
  scenarioId: string;
  scenarioLabel: string;
};

type TProps = {
  eyebrow: string;
  heading: string;
  bridge: string;
  botReply: string;
  lines: TLine[];
  timeLabels: string[];
  chipHrefs: string[];
};

// ─── Motion constants ────────────────────────────────────────────────────────

const EASE = MOTION_EASE.out;

/** Slower-than-default rise reveal for each bubble row. */
const BUBBLE_REVEAL_DURATION = DUR_REVEAL * 1.5;

/**
 * Rise-up reveal for each bubble row. Each bubble drives its own
 * `whileInView` so messages appear one-by-one as the user scrolls past them.
 */
const BUBBLE_RISE = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: BUBBLE_REVEAL_DURATION, ease: EASE },
  },
} as const;

/** Trigger each bubble's reveal when it's well into the viewport. */
const BUBBLE_VIEWPORT = { once: true, amount: 0.8 } as const;

/**
 * Gentle idle drift keyframe sequences.
 * Each entry: [rest, swing-one-way, rest, swing-other-way, rest]
 * Ensures loop start == loop end (no jump).
 */
const DRIFT_CONFIGS = [
  { rotate: [-1.5, -3, -1.5, -0.5, -1.5] as number[], y: [0, -4, 0, 3, 0] as number[], duration: 5.8 },
  { rotate: [1.2, 2.5, 1.2, 0.2, 1.2] as number[], y: [0, 3, 0, -3, 0] as number[], duration: 6.4 },
  { rotate: [-1, -2.2, -1, 0.2, -1] as number[], y: [0, -3, 0, 2, 0] as number[], duration: 7.1 },
  // bot bubble gets its own slower drift
  { rotate: [0.8, 1.8, 0.8, -0.3, 0.8] as number[], y: [0, -5, 0, 4, 0] as number[], duration: 8.2 },
] as const;

/** Static rest angles for reduced-motion. */
const REST_ROTATE = [-1.5, 1.2, -1, 0.8] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────

type TMeBubbleProps = {
  text: string;
  timeLabel: string;
  driftIdx: number;
  shouldReduce: boolean;
};

const MeBubble = ({ text, timeLabel, driftIdx, shouldReduce }: TMeBubbleProps) => {
  const restRotate = REST_ROTATE[driftIdx] ?? 0;

  return (
    <motion.li
      className="flex justify-end"
      variants={BUBBLE_RISE}
      initial={shouldReduce ? false : 'hidden'}
      whileInView="show"
      viewport={BUBBLE_VIEWPORT}
    >
      <motion.div
        className="relative max-w-(--width-bubble-me) rounded-2xl rounded-br-md bg-tg-bubble-me px-4 py-3 shadow-(--shadow-soft)"
        /**
         * Static floating tilt (parящий вид) — no idle drift.
         * framer-motion `style` with a literal rotate is the allowed
         * exception to the no-inline-style rule.
         */
        style={{ rotate: restRotate }}
      >
        <p className="m-0 text-15 leading-snug text-tg-bubble-me-ink">{text}</p>
        <div className="mt-1 flex items-center justify-end gap-1 text-mini text-tg-bubble-me-accent">
          <span>{timeLabel}</span>
          <DoubleCheckIcon size={12} />
        </div>
      </motion.div>
    </motion.li>
  );
};

type TBotBubbleProps = {
  botReply: string;
  lines: TLine[];
  chipHrefs: string[];
  shouldReduce: boolean;
};

const BotBubble = ({ botReply, lines, chipHrefs, shouldReduce }: TBotBubbleProps) => {
  const drift = DRIFT_CONFIGS[3] ?? DRIFT_CONFIGS[0];
  const restRotate = REST_ROTATE[3];

  return (
    <motion.div
      className="mt-6 flex justify-start"
      variants={BUBBLE_RISE}
      initial={shouldReduce ? false : 'hidden'}
      whileInView="show"
      viewport={BUBBLE_VIEWPORT}
    >
      <motion.div
        className="relative max-w-(--width-bubble-bot) rounded-2xl rounded-bl-md border border-primary/30 bg-primary px-4 py-4 shadow-(--shadow-mid)"
        style={{ rotate: restRotate }}
        {...(!shouldReduce && {
          animate: {
            rotate: drift.rotate,
            y: drift.y,
          },
          transition: {
            rotate: {
              times: [0, 0.25, 0.5, 0.75, 1],
              duration: drift.duration,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop' as const,
            },
            y: {
              times: [0, 0.25, 0.5, 0.75, 1],
              duration: drift.duration,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop' as const,
            },
          },
        })}
      >
        <p className="m-0 mb-3 text-15 font-semibold leading-snug text-white">{botReply}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {lines.map((line, idx) => (
            <li key={line.scenarioId}>
              <a
                href={chipHrefs[idx] ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-3 py-1 text-13 font-semibold text-white transition-colors hover:bg-white hover:text-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {line.scenarioLabel}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

// ─── Main client component ────────────────────────────────────────────────────

export const PainMirrorChat = ({
  eyebrow,
  heading,
  bridge,
  botReply,
  lines,
  timeLabels,
  chipHrefs,
}: TProps) => {
  const shouldReduce = useReducedMotion() ?? false;

  return (
    /*
     * Asymmetric desktop split: left (copy) is narrower (5fr), right (chat) wider (7fr).
     * Mobile: single column — heading on top, chat below, bridge at bottom.
     */
    <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:items-center">
      {/* ── Left column: eyebrow + H2 + bridge ─────────────────────────── */}
      <motion.div
        className="text-center lg:text-left"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: DUR_REVEAL, ease: EASE }}
      >
        <p className="m-0 font-mono text-sm font-semibold uppercase tracking-(--tracking-loose) text-primary">
          {eyebrow}
        </p>
        <h2
          id="pain-mirror-chat-heading"
          className="section-title mt-3 text-ink"
        >
          {heading}
        </h2>
        <p className="mt-5 text-balance text-17 leading-relaxed text-muted">
          {bridge}
        </p>
      </motion.div>

      {/* ── Right column: chat thread ────────────────────────────────────── */}
      {/* Each bubble drives its own whileInView → messages appear one-by-one on scroll. */}
      <div className="w-full">
        {/* User messages */}
        <ul className="m-0 list-none space-y-2 p-0">
          {lines.map((line, idx) => (
            <MeBubble
              key={line.scenarioId}
              text={line.text}
              timeLabel={timeLabels[idx] ?? ''}
              driftIdx={idx % 3}
              shouldReduce={shouldReduce}
            />
          ))}
        </ul>

        {/* Bot reply with chips */}
        <BotBubble
          botReply={botReply}
          lines={lines}
          chipHrefs={chipHrefs}
          shouldReduce={shouldReduce}
        />
      </div>
    </div>
  );
};
