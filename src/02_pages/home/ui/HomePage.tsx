import { HomeHero } from '@/widgets/home-hero';
import { HomeAdvantages } from '@/widgets/home-advantages';
import { HomeHowItWorks } from '@/widgets/home-how-it-works';
import { HomeSchedule } from '@/widgets/home-schedule';
import { HomeCompare } from '@/widgets/home-compare';
import { HomePricingTeaser } from '@/widgets/home-pricing-teaser';
import { HomeUkraineProgramme } from '@/widgets/home-ukraine-programme';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export function HomePage() {
  return (
    <main id="main-content">
      <HomeHero />
      <HomeAdvantages />
      <HomeHowItWorks />
      <HomeSchedule />
      <HomeCompare />
      <HomePricingTeaser />
      <HomeUkraineProgramme />
      <FinalCtaWithFomo />
    </main>
  );
}
