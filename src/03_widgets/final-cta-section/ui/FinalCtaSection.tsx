import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink, Container, Reveal, Section } from '@/shared/ui';
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
    <Section
      id={ANCHORS.cta}
      ariaLabelledBy="final-cta-heading"
      className="py-16 md:py-22"
    >
      <Container>
        <Reveal variant="up">
          <div className="final-panel px-6 py-14 text-center sm:px-12 sm:py-16">
            <h2
              id="final-cta-heading"
              className="h-display-section mx-0 mb-3.5 font-extrabold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              {t('title')}
            </h2>
            <p className="mx-auto mb-7 max-w-140 text-17 leading-relaxed text-muted">
              {t('subtitle')}
            </p>

            <ButtonLink href={buildBotUrl(locale)} variant="primary" size="lg">
              {t('cta')}
            </ButtonLink>

            <div className="mt-4 text-13-5 text-muted">{t('meta')}</div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
