import { PageHero } from '@/widgets/page-hero';
import { FlowSectionWithPhone } from '@/widgets/flow-section-with-phone';
import { PrivacyFeatureGrid } from '@/widgets/privacy-feature-grid';
import { FaqSection } from '@/widgets/faq-section';
import { FinalCtaSection } from '@/widgets/final-cta-section';

export const HowItWorksPage = () => {
  return (
    <>
      <PageHero namespace="HowItWorksPage.hero" decoration="waveform" />
      <FlowSectionWithPhone />
      <PrivacyFeatureGrid />
      <FaqSection namespace="HowItWorksPage.faq" />
      <FinalCtaSection namespace="HowItWorksPage.finalCta" />
    </>
  );
}
