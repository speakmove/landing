'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MOTION_DURATION } from '@/shared/ui';

type TProps = {
  statuses: string[];
  /** ms between status changes */
  intervalMs?: number;
};

/**
 * Rotates through a list of bot status strings (e.g. "Записывает аудио…" →
 * "Обрабатывает…" → "Отвечает") with a soft cross-fade. Lives inside the
 * Telegram chat header pill of the hero phone preview to give the mockup
 * a sense of being alive.
 *
 * Respects prefers-reduced-motion — shows the first status statically.
 */
export const RotatingStatus = ({ statuses, intervalMs = 3000 }: TProps) => {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % statuses.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [statuses.length, intervalMs, reduced]);

  if (reduced || statuses.length <= 1) {
    return <>{statuses[0]}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: MOTION_DURATION.base, ease: 'easeOut' }}
        className="inline-block"
      >
        {statuses[idx]}
      </motion.span>
    </AnimatePresence>
  );
};
