import { getTranslations } from 'next-intl/server';
import { ButtonLink, Container } from '@/shared/ui';
import { URLS } from '@/shared/config';

/**
 * /pricing hero with a per-day price reframe.
 * Big display "£0.25 / day" anchors visual attention; the real monthly
 * price sits underneath as a smaller equality so nothing is hidden.
 */
export const PricingHero = async () => {
  const t = await getTranslations('PricingPage.hero');

  return (
    <header className="relative overflow-hidden px-5 pt-16 pb-12 text-center md:px-6 md:pt-20 md:pb-20">
      <div aria-hidden="true" className="page-hero-bg" />

      <Container>
        <div className="relative z-10 mx-auto max-w-190">
          <div className="section-eyebrow !mb-0">{t('crumb')}</div>

          <h1 className="h-display-page my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink">
            {t('title')}
          </h1>

          <p className="mx-auto max-w-160 text-pretty text-lg text-muted">
            {t('description')}
          </p>

          <div className="mt-10 flex flex-col items-center md:mt-12">
            <div className="inline-flex items-baseline gap-3">
              <span className="h-display-price font-extrabold tracking-tight text-primary-ink">
                {t('perDay')}
              </span>
              <span className="text-2xl font-semibold text-muted md:text-3xl">
                {t('perDayUnit')}
              </span>
            </div>
            <p className="mt-3 m-0 font-mono text-15 text-muted">
              {t('perMonth')}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 md:mt-10">
            <ButtonLink href={URLS.telegramBot} variant="primary" size="lg">
              {t('cta')}
            </ButtonLink>
            <p className="m-0 text-13 text-muted">{t('ctaFootnote')}</p>
          </div>
        </div>
      </Container>
    </header>
  );
};
