import { PageHeroWithStats } from '@/widgets/page-hero-with-stats';
import { FlowSectionWithPhone } from '@/widgets/flow-section-with-phone';
import { PrivacyFeatureGrid } from '@/widgets/privacy-feature-grid';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const HowItWorksPage = () => {
  return (
    <>
      <PageHeroWithStats />
      <FlowSectionWithPhone />
      <PrivacyFeatureGrid />
      <FinalCtaWithFomo namespace="HowItWorksPage.finalCta" />
    </>
  );
}
