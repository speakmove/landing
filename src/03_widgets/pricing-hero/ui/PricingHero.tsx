import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink, Container, JsonLd } from '@/shared/ui';
import { env } from '@/shared/model/libs/env';
import { routing } from '@/shared/model/libs/i18n/routing';
import { buildBotUrl } from '@/shared/model/utils';
import { buildSoftwareApplicationLd } from '@/shared/model/libs/jsonld';

/**
 * /pricing hero with a per-day price reframe.
 * Big display "£0.33 / day" anchors visual attention; the real monthly
 * price sits underneath as a smaller equality so nothing is hidden.
 *
 * Emits a Product (SoftwareApplication) + Offer JSON-LD block so search
 * engines and AI assistants can surface the price + free trial directly.
 */
export const PricingHero = async () => {
  const t = await getTranslations('PricingPage.hero');
  const tSd = await getTranslations('PricingPage.structuredData');
  const tMeta = await getTranslations('MetaGlobal');
  const locale = await getLocale();
  const botUrl = buildBotUrl(locale);

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const productLd = buildSoftwareApplicationLd({
    name: tMeta('siteName'),
    description: tMeta('defaultDescription'),
    applicationCategory: tSd('applicationCategory'),
    operatingSystem: tSd('operatingSystem'),
    inLanguage: routing.locales,
    url: `${siteUrl}/`,
    offer: {
      price: tSd('price'),
      priceCurrency: tSd('priceCurrency'),
      unitText: tSd('unitText'),
      botUrl,
      areaServed: tSd('areaServed'),
    },
  });

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
            <ButtonLink href={botUrl} variant="primary" size="lg">
              {t('cta')}
            </ButtonLink>
            <p className="mt-3 m-0 text-12-5 text-muted">{t('ctaFootnote')}</p>
          </div>
        </div>
      </Container>
      <JsonLd data={productLd} />
    </header>
  );
};
