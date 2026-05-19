import { PageHero } from '@/widgets/page-hero';
import { PricingPlanCard } from '@/widgets/pricing-plan-card';
import { PricingUnitEconomics } from '@/widgets/pricing-unit-economics';
import { PricingComparisonContext } from '@/widgets/pricing-comparison-context';
import { PricingFaqSection } from '@/widgets/pricing-faq-section';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const PricingPage = () => {
  return (
    <>
      <PageHero namespace="PricingPage.hero" />
      <PricingPlanCard />
      <PricingUnitEconomics />
      <PricingComparisonContext />
      <PricingFaqSection />
      <FinalCtaWithFomo namespace="PricingPage.finalCta" />
    </>
  );
}
