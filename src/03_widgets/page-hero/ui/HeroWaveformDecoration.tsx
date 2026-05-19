import { WaveformBars } from '@/shared/ui';

const BAR_COUNT = 100;

/**
 * Deterministic, voice-message-style heights for a decorative hero strip.
 * Same seed across SSR/CSR so hydration is stable; values are tuned to
 * read as a "voice envelope" rather than a generic equalizer.
 */
const buildHeroBars = (): number[] => {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const wave = Math.sin(i * 0.7 + 1) * Math.cos(i * 0.31 + 0.5);
    return 4 + Math.abs(wave) * 30;
  });
};

/**
 * Decorative voice-waveform strip pinned to the bottom of a hero.
 * Lives behind text content via the parent's stacking context. Edges
 * fade to transparent through the `.hero-waveform-mask` mask-image,
 * so the strip blends into the page background.
 */
export const HeroWaveformDecoration = () => {
  const bars = buildHeroBars();
  return (
    <div
      aria-hidden="true"
      className="hero-waveform-mask pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 overflow-hidden md:h-24"
    >
      <WaveformBars
        bars={bars}
        step={6}
        thickness={2.4}
        centerY={20}
        preserveAspectRatio="none"
        className="block h-full w-full fill-primary opacity-15"
      />
    </div>
  );
};
