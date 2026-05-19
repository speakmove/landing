import { HomeHero } from '@/widgets/home-hero';
import { HomePainMirror } from '@/widgets/home-pain-mirror';
import { HomeHowItWorks } from '@/widgets/home-how-it-works';
import { HomeScenariosGrid } from '@/widgets/home-scenarios-grid';
import { HomeAdvantages } from '@/widgets/home-advantages';
import { HomeFounderCards } from '@/widgets/home-founder-cards';
import { HomePricingCard } from '@/widgets/home-pricing-card';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const HomePage = () => {
  return (
    <>
      <HomeHero />
      <HomePainMirror />
      <HomeHowItWorks />
      <HomeScenariosGrid />
      <HomeAdvantages />
      <HomeFounderCards />
      <HomePricingCard />
      <FinalCtaWithFomo />
    </>
  );
}
