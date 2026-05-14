import { getTranslations } from 'next-intl/server';
import { PricingInteractive } from '@/widgets/pricing-interactive';
import { PricingFeatureComparisonTable } from '@/widgets/pricing-feature-comparison-table';
import { CoinEconomicsSection } from '@/widgets/coin-economics-section';
import { PricingFaqSection } from '@/widgets/pricing-faq-section';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';
import type { TPricingPlan } from '@/entities/pricing-plan';

export const PricingPage = async () => {
  const t = await getTranslations('PricingPage');

  const plans = t.raw('plans') as unknown as TPricingPlan[];
  const disclaimer = t('disclaimer');

  const hero = {
    crumb: t('hero.crumb'),
    title: t('hero.title'),
    description: t('hero.description'),
  };

  const billingLabels = {
    monthly: t('hero.billingToggle.monthly'),
    yearly: t('hero.billingToggle.yearly'),
    yearlySaveLabel: t('hero.billingToggle.yearlySaveLabel'),
  };

  const fomo = {
    title: t('hero.fomo.title'),
    plansLine: t('hero.fomo.plansLine'),
    countLabel: t('hero.fomo.countLabel'),
    current: t.raw('hero.fomo.current') as unknown as number,
    total: t.raw('hero.fomo.total') as unknown as number,
  };

  return (
    <>
      <PricingInteractive
        hero={hero}
        plans={plans}
        billingLabels={billingLabels}
        fomo={fomo}
        disclaimer={disclaimer}
      />
      <PricingFeatureComparisonTable />
      <CoinEconomicsSection />
      <PricingFaqSection />
      <FinalCtaWithFomo namespace="PricingPage.finalCta" />
    </>
  );
}
