import type { ComponentPropsWithRef } from 'react';

const BARS = [10, 24, 14, 30, 18, 26, 12, 22, 16] as const;

/**
 * Telegram-style voice waveform bars.
 * Each bar gets className="voicewave-bar" and data-i for CSS keyframe animation.
 */
export const VoiceWave = ({ className, ...rest }: ComponentPropsWithRef<'svg'>) => {
  return (
    <svg
      viewBox="0 0 60 32"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {BARS.map((h, i) => (
        <rect
          key={i}
          width={3}
          rx={1.5}
          fill="currentColor"
          x={i * 6.5}
          y={(32 - h) / 2}
          height={h}
          className="voicewave-bar"
          data-i={i}
        />
      ))}
    </svg>
  );
};
