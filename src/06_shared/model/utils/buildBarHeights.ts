/**
 * Deterministic pseudo-random bar heights for decorative charts/waveforms.
 * Same `seed` produces the same sequence on SSR and client (hydration-safe).
 *
 * @param count - number of bars to produce
 * @param seed - integer seed (start with 1)
 * @param range - tuple of [minHeight, maxHeight] in percent, e.g. [10, 100]
 */
export const buildBarHeights = (
  count: number,
  seed: number,
  range: readonly [number, number] = [10, 100],
): number[] => {
  const [min, max] = range;
  const span = max - min;
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i * 0.7 + seed) * Math.cos(i * 0.31 + seed * 0.5);
    return min + Math.abs(wave) * span;
  });
};
