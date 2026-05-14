import { PageHeroWithStats } from '@/widgets/page-hero-with-stats';
import { FlowSectionWithPhone } from '@/widgets/flow-section-with-phone';
import { CefrProgression } from '@/widgets/cefr-progression';
import { SmartCriteriaGrid } from '@/widgets/smart-criteria-grid';
import { HomeSchedule } from '@/widgets/home-schedule';
import { CoinEconomyGrid } from '@/widgets/coin-economy-grid';
import { PrivacyFeatureGrid } from '@/widgets/privacy-feature-grid';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const HowItWorksPage = () => {
  return (
    <main id="main-content">
      <PageHeroWithStats />
      <FlowSectionWithPhone />
      <CefrProgression />
      <SmartCriteriaGrid />
      <HomeSchedule namespace="HowItWorksPage.schedule" />
      <CoinEconomyGrid />
      <PrivacyFeatureGrid />
      <FinalCtaWithFomo namespace="HowItWorksPage.finalCta" />
    </main>
  );
}
