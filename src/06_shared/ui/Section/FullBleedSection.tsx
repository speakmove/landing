import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';
import { Container } from '@/shared/ui/Container';
import { WaveDivider } from '@/shared/ui/Icon';

type TBleed = 'cta';

type TProps = PropsWithChildren<{
  bleed: TBleed;
  id?: string;
  className?: string;
  ariaLabelledBy?: string;
  /**
   * Fill color of the WaveDivider cap rendered at the top of this section.
   * Should match the background color of the section sitting ABOVE this one
   * so the wave reads as the upper section's color dipping into the bleed block.
   *
   * Defaults to white (#ffffff) — correct when the preceding section has a
   * white or no explicit tone.
   */
  waveColor?: string;
}>;

const BLEED_CLASS: Record<TBleed, string> = {
  cta: 'section-bleed-cta',
};

export const FullBleedSection = ({
  bleed,
  id,
  className,
  ariaLabelledBy,
  waveColor = '#ffffff',
  children,
}: TProps) => {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn('section-full-bleed', BLEED_CLASS[bleed], className)}
    >
      {/* Wave cap — color = upper section's bg, overlaps by 1px to kill seam */}
      <div className="section-wave-cap" aria-hidden="true">
        <WaveDivider fill={waveColor} className="section-wave-svg" />
      </div>

      <Container className="px-5 py-14 md:px-6 md:py-20">{children}</Container>
    </section>
  );
};
