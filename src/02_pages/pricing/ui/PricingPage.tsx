import { getLocale, getTranslations } from 'next-intl/server';
import { PricingHero } from '@/widgets/pricing-hero';
import { PricingTrustStrip } from '@/widgets/pricing-trust-strip';
import { PricingPlanCard } from '@/widgets/pricing-plan-card';
import { PricingUnitEconomics } from '@/widgets/pricing-unit-economics';
import { PricingComparisonContext } from '@/widgets/pricing-comparison-context';
import { FaqSection } from '@/widgets/faq-section';
import { FinalCtaSection } from '@/widgets/final-cta-section';
import { JsonLd } from '@/shared/ui';
import { buildBreadcrumbLd, buildSpeakableLd } from '@/shared/model/libs/jsonld';
import { env } from '@/shared/model/libs/env';

export const PricingPage = async () => {
  const locale = await getLocale();
  const tNav = await getTranslations('HomePage.nav.links');
  const tCommon = await getTranslations('Common');

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const breadcrumbLd = buildBreadcrumbLd([
    { name: tCommon('breadcrumb.home'), url: `${siteUrl}/${locale}` },
    { name: tNav('pricing'), url: `${siteUrl}/${locale}/pricing` },
  ]);

  const speakableLd = buildSpeakableLd(['h1', '.speakable']);

  return (
    <>
      <PricingHero />
      <PricingTrustStrip />
      <PricingPlanCard />
      <PricingUnitEconomics />
      <PricingComparisonContext />
      <FaqSection namespace="PricingPage.faq" />
      {/* FAQ above is the soft band → wave cap matches it (no seam). */}
      <FinalCtaSection namespace="PricingPage.finalCta" waveColor="#f7f8f5" />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={speakableLd} />
    </>
  );
};
