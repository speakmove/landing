type TProps = {
  /** Heights of each bar in px. Determines bar count and visual rhythm. */
  bars: number[];
  /** Width per bar (including gap) in SVG units. Default 3.2. */
  step?: number;
  /** Bar thickness in SVG units. Default 1.6. */
  thickness?: number;
  /** Vertical center of the canvas. Default 9. */
  centerY?: number;
  className?: string;
};

/**
 * Telegram-style voice-message waveform.
 * Each bar centered vertically; height comes from the `bars` array.
 * SVG dimensions are derived from bar count + step so callers don't pass width/height.
 */
export const WaveformBars = ({
  bars,
  step = 3.2,
  thickness = 1.6,
  centerY = 9,
  className,
}: TProps) => {
  const width = bars.length * step;
  const height = centerY * 2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {bars.map((h, i) => (
        <rect key={i} x={i * step} y={centerY - h / 2} width={thickness} height={h} rx={thickness / 2} />
      ))}
    </svg>
  );
};
