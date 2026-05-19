import { PageHero } from '@/widgets/page-hero';
import { PricingFaqSection } from '@/widgets/pricing-faq-section';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const PricingPage = () => {
  return (
    <>
      <PageHero namespace="PricingPage.hero" />
      <PricingFaqSection />
      <FinalCtaWithFomo namespace="PricingPage.finalCta" />
    </>
  );
}
