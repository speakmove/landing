'use client';

import { useEffect, type ReactNode } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { MapPinIcon, MessageCircleIcon, MicIcon, ShieldIcon, TelegramIcon } from '@/shared/ui';

export type TDrawIconProps = {
  id: string;
  drawDelay?: number;
  flashDelay?: number;
  isVisible?: boolean;
};

// ─── Variants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const svgV = {
  hidden: {},
  draw: { transition: { staggerChildren: 0.13 } },
  flash: {
    filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'],
    transition: { duration: 0.35, times: [0, 0.4, 1] as number[] },
  },
};

const pathV = {
  hidden: { pathLength: 0, opacity: 0 },
  draw: { pathLength: 1, opacity: 1, transition: { duration: 0.55, ease: EASE } },
  flash: { pathLength: 1, opacity: 1 }, // stays drawn — parent SVG handles filter
};

const tgSvgV = {
  hidden: { scale: 0.5, opacity: 0 },
  draw: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: EASE } },
  flash: {
    filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'],
    transition: { duration: 0.35, times: [0, 0.4, 1] as number[] },
  },
};

// ─── Path mapper (Record replaces switch/case) ───────────────────────────────
// motion.* elements propagate animation via Framer Motion context from parent svg

const STROKE_PATHS: Record<string, ReactNode> = {
  voice: (
    <>
      <motion.rect variants={pathV} x="9" y="2" width="6" height="12" rx="3" />
      <motion.path variants={pathV} d="M5 10a7 7 0 0 0 14 0" />
      <motion.line variants={pathV} x1="12" y1="19" x2="12" y2="22" />
    </>
  ),
  'uk-scenarios': (
    <>
      <motion.path variants={pathV} d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <motion.circle variants={pathV} cx="12" cy="10" r="3" />
    </>
  ),
  'native-feedback': (
    <motion.path
      variants={pathV}
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
    />
  ),
  'honest-pricing': (
    <motion.path variants={pathV} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),
};

const STATIC: Record<string, ReactNode> = {
  voice: <MicIcon size={24} />,
  'uk-scenarios': <MapPinIcon size={24} />,
  'native-feedback': <MessageCircleIcon size={24} />,
  'in-telegram': <TelegramIcon size={24} />,
  'honest-pricing': <ShieldIcon size={24} />,
};

const BASE_SVG = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
  focusable: false as const,
};

// ─── Inner animated component (hooks always called) ──────────────────────────

const DrawIconAnimated = ({ id, drawDelay = 0, flashDelay = 0, isVisible = false }: TDrawIconProps) => {
  const controls = useAnimation();

  useEffect(() => {
    if (!isVisible) return;
    const t1 = setTimeout(() => void controls.start('draw'), drawDelay * 1000);
    const t2 = setTimeout(() => void controls.start('flash'), flashDelay * 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isVisible, drawDelay, flashDelay, controls]);

  if (id === 'in-telegram') {
    return (
      <motion.svg
        {...BASE_SVG}
        fill="currentColor"
        stroke="none"
        strokeWidth={0}
        animate={controls}
        variants={tgSvgV}
        initial="hidden"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </motion.svg>
    );
  }

  const paths = STROKE_PATHS[id];
  if (!paths) return null;

  return (
    <motion.svg {...BASE_SVG} animate={controls} variants={svgV} initial="hidden">
      {paths}
    </motion.svg>
  );
};

// ─── Public export: static fallback for reduced motion ───────────────────────

export const DrawIcon = (props: TDrawIconProps) => {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <>{STATIC[props.id] ?? null}</>;
  return <DrawIconAnimated {...props} />;
};
