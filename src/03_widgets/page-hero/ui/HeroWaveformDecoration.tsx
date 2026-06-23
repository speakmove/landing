import { WaveformBars } from '@/shared/ui';

/**
 * Deterministic, voice-message-style heights for a decorative hero strip.
 * Same seed across SSR/CSR so hydration is stable; values read as a "voice
 * envelope" rather than a generic equalizer.
 */
const buildHeroBars = (count: number): number[] =>
  Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i * 0.7 + 1) * Math.cos(i * 0.31 + 0.5);
    return 4 + Math.abs(wave) * 30;
  });

// Desktop fills a wide strip; mobile uses fewer bars so each reads thicker
// (the SVG is stretched to full width via preserveAspectRatio="none", so on a
// narrow viewport 100 bars compress to hairlines).
const DESKTOP_BARS = buildHeroBars(100);
const MOBILE_BARS = buildHeroBars(44);

/**
 * Decorative voice-waveform strip pinned to the bottom of a hero.
 * Lives behind text content via the parent's stacking context. Edges fade to
 * transparent through the `.hero-waveform-mask` mask-image.
 */
export const HeroWaveformDecoration = () => (
  <div
    aria-hidden="true"
    className="hero-waveform-mask pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 overflow-hidden md:h-24"
  >
    {/* Mobile — fewer, thicker bars */}
    <WaveformBars
      bars={MOBILE_BARS}
      step={6}
      thickness={2.8}
      centerY={20}
      preserveAspectRatio="none"
      className="block h-full w-full fill-primary opacity-15 sm:hidden"
    />
    {/* Desktop — dense strip */}
    <WaveformBars
      bars={DESKTOP_BARS}
      step={6}
      thickness={2.4}
      centerY={20}
      preserveAspectRatio="none"
      className="hidden h-full w-full fill-primary opacity-15 sm:block"
    />
  </div>
);
