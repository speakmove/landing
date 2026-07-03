import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink, FullBleedSection, Reveal, VoiceWave } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
import { buildBotUrl } from '@/shared/model/utils';

type TProps = {
  namespace?: string;
  /**
   * Fill colour of the wave cap at the top of the section — should match the
   * background of the section directly above on each page so the wave reads as
   * that section dipping into the emerald block (no seam). Defaults to white.
   */
  waveColor?: string;
};

export const FinalCtaSection = async ({
  namespace = 'HomePage.finalCta',
  waveColor,
}: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);
  const locale = await getLocale();

  return (
    <FullBleedSection
      bleed="cta"
      id={ANCHORS.cta}
      ariaLabelledBy="final-cta-heading"
      waveColor={waveColor}
    >
      <div className="relative">
        {/* Ambient emerald glow behind the wave + heading (decor) */}
        <div className="finalcta-glow glow-breathe" aria-hidden="true" />

        {/* Content reveals on scroll-in, like the section headings elsewhere. */}
        <Reveal
          variant="rise"
          className="relative mx-auto flex max-w-160 flex-col items-center text-center"
        >
          {/* Voice waveform — light on the dark emerald bg (decor) */}
          <VoiceWave className="finalcta-wave mb-7" aria-hidden="true" />

          <h2
            id="final-cta-heading"
            className="mb-4 font-extrabold leading-[1.1] tracking-[-0.025em] text-white h-display-section"
          >
            {t('title')}
          </h2>

          <ButtonLink
            href={buildBotUrl(locale, 'landing-final-cta')}
            variant="primary"
            size="lg"
            className="btn-on-emerald"
          >
            {t('cta')}
          </ButtonLink>

          <div className="mt-7 text-10 md:text-12 text-white/70">{t('meta')}</div>
        </Reveal>
      </div>
    </FullBleedSection>
  );
};
