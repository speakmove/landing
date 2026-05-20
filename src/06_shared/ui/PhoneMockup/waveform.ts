/**
 * Deterministic waveform-bar heights for a single voice message.
 * Same `seed` produces the same heights on SSR and CSR, so React hydration matches.
 */
export const buildWaveformBars = (seed: number, count = 45): number[] => {
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i * 0.7 + seed) * Math.cos(i * 0.31 + seed * 0.5);
    return 3 + Math.abs(wave) * 13;
  });
};
