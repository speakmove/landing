import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink, FullBleedSection, Reveal, VoiceWave } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
import { buildBotUrl } from '@/shared/model/utils';

type TProps = {
  namespace?: string;
};

export const FinalCtaSection = async ({ namespace = 'HomePage.finalCta' }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);
  const locale = await getLocale();

  return (
    <FullBleedSection
      bleed="cta"
      id={ANCHORS.cta}
      ariaLabelledBy="final-cta-heading"
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
            className="mb-3.5 font-extrabold leading-[1.1] tracking-[-0.025em] text-white h-display-section"
          >
            {t('title')}
          </h2>

          <p className="mx-auto mb-7 max-w-140 text-17 leading-relaxed text-white/70">
            {t('subtitle')}
          </p>

          <ButtonLink
            href={buildBotUrl(locale)}
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
