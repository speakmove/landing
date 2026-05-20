import { PricingHero } from '@/widgets/pricing-hero';
import { PricingTrustStrip } from '@/widgets/pricing-trust-strip';
import { PricingPlanCard } from '@/widgets/pricing-plan-card';
import { PricingUnitEconomics } from '@/widgets/pricing-unit-economics';
import { PricingComparisonContext } from '@/widgets/pricing-comparison-context';
import { FaqSection } from '@/widgets/faq-section';
import { FinalCtaSection } from '@/widgets/final-cta-section';

export const PricingPage = () => {
  return (
    <>
      <PricingHero />
      <PricingTrustStrip />
      <PricingPlanCard />
      <PricingUnitEconomics />
      <PricingComparisonContext />
      <FaqSection namespace="PricingPage.faq" />
      <FinalCtaSection namespace="PricingPage.finalCta" />
    </>
  );
}
