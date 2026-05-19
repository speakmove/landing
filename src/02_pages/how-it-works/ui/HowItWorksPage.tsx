import { PageHero } from '@/widgets/page-hero';
import { FlowSectionWithPhone } from '@/widgets/flow-section-with-phone';
import { PrivacyFeatureGrid } from '@/widgets/privacy-feature-grid';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const HowItWorksPage = () => {
  return (
    <>
      <PageHero namespace="HowItWorksPage.hero" decoration="waveform" />
      <FlowSectionWithPhone />
      <PrivacyFeatureGrid />
      <FinalCtaWithFomo namespace="HowItWorksPage.finalCta" />
    </>
  );
}
