import { HomeHero } from '@/widgets/home-hero';
import { HomeAdvantages } from '@/widgets/home-advantages';
import { HomeHowItWorks } from '@/widgets/home-how-it-works';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const HomePage = () => {
  return (
    <>
      <HomeHero />
      <HomeAdvantages />
      <HomeHowItWorks />
      <FinalCtaWithFomo />
    </>
  );
}
