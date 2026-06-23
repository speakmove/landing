import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink, Container, JsonLd } from '@/shared/ui';
import { env } from '@/shared/model/libs/env';
import { routing } from '@/shared/model/libs/i18n/routing';
import { buildBotUrl } from '@/shared/model/utils';
import { buildSoftwareApplicationLd } from '@/shared/model/libs/jsonld';
import { PricingHeroTitle } from './PricingHeroTitle';

/**
 * /pricing hero — offer-focused, letter-reveal H1.
 *
 * The H1 animates in letter-by-letter (blur → clear) via SplitTextReveal,
 * with the price clause accented. The per-day price reframe and the
 * risk-reversal footnote now live inside the pricing card, not here.
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

          <PricingHeroTitle title={t('title')} />

          <p className="mx-auto max-w-160 text-pretty text-lg text-muted">
            {t('description')}
          </p>

          <div className="mt-8 flex flex-col items-center md:mt-10">
            <ButtonLink href={botUrl} variant="primary" size="lg">
              {t('cta')}
            </ButtonLink>
          </div>
        </div>
      </Container>
      <JsonLd data={productLd} />
    </header>
  );
};
