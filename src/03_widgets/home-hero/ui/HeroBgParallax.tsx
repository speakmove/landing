'use client';

import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { useParallaxLayers } from '@/shared/model/hooks';
import {
  VoiceWave,
  MicIcon,
  MessageCircleIcon,
  WaveformBars,
} from '@/shared/ui';

/**
 * Hero background layer — decorative only, aria-hidden.
 *
 * Renders:
 *  1. Faint CSS grid + radial gradient bg (`.hero-bg-grid`) at low parallax depth.
 *  2. Static ambient emerald blob (`.hero-ambient-blob`) — atmosphere.
 *  3. Four voice-motif icons (VoiceWave, Mic, MessageCircle, WaveformBars)
 *     at deterministic positions with different parallax depth factors.
 *
 * Parallax source:
 *  - Desktop (pointer: fine) → cursor-driven via `useParallaxLayers`.
 *  - Touch (pointer: coarse) → scroll-driven (smaller amplitude from hook).
 *  - Reduced-motion → all MotionValues stay at 0 (fully static).
 *
 * Contrast: all icons and grid are extremely faint (opacity 6–8%) and
 * monochrome-primary. The hero H1/body text sits above on a white/light
 * background at z-10 — WCAG AA contrast is unaffected.
 */

const WAVEFORM_BARS_TALL = [6, 14, 9, 18, 12, 16, 8, 15, 10] as const;

export const HeroBgParallax = () => {
  const { ref, layer } = useParallaxLayers();

  const gridLayer = layer(0.08);
  const iconLayer1 = layer(0.22);
  const iconLayer2 = layer(0.18);
  const iconLayer3 = layer(0.15);
  const iconLayer4 = layer(0.25);

  return (
    <div aria-hidden="true" className="hero-parallax-root">
      {/*
       * Pointer-tracking sentinel: transparent, covers full hero area.
       * `useParallaxLayers` attaches pointermove/leave to this element.
       * It is visually empty — no styling, no pointer-events interception
       * for user content (hero content sits above at z-10).
       */}
      <div ref={ref as RefObject<HTMLDivElement>} className="absolute inset-0" />

      {/* Grid + radial gradient — shallowest depth */}
      <motion.div
        className="hero-bg-grid"
        style={{ x: gridLayer.x, y: gridLayer.y }}
      />

      {/* Ambient blob — static, no parallax (pure atmosphere) */}
      <div className="hero-ambient-blob" />

      {/* Voice-motif icon 1: VoiceWave — top-left */}
      <motion.div
        className="hero-icon-pos hero-icon-pos--1 hero-icon-faint-a hero-icon-rotate-1"
        style={{ x: iconLayer1.x, y: iconLayer1.y }}
      >
        <VoiceWave width={64} height={34} className="text-primary" />
      </motion.div>

      {/* Voice-motif icon 2: MicIcon — right-center */}
      <motion.div
        className="hero-icon-pos hero-icon-pos--2 hero-icon-faint-b hero-icon-rotate-2"
        style={{ x: iconLayer2.x, y: iconLayer2.y }}
      >
        <MicIcon size={40} className="text-primary" />
      </motion.div>

      {/* Voice-motif icon 3: MessageCircleIcon — lower-left */}
      <motion.div
        className="hero-icon-pos hero-icon-pos--3 hero-icon-faint-c hero-icon-rotate-3"
        style={{ x: iconLayer3.x, y: iconLayer3.y }}
      >
        <MessageCircleIcon size={48} className="text-primary" />
      </motion.div>

      {/* Voice-motif icon 4: WaveformBars — top-right */}
      <motion.div
        className="hero-icon-pos hero-icon-pos--4 hero-icon-faint-a hero-icon-rotate-4"
        style={{ x: iconLayer4.x, y: iconLayer4.y }}
      >
        <WaveformBars
          bars={[...WAVEFORM_BARS_TALL]}
          step={4}
          thickness={2}
          centerY={12}
          className="fill-current text-primary"
        />
      </motion.div>
    </div>
  );
};
