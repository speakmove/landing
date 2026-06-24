import { getLocale, getTranslations } from 'next-intl/server';
import { HomeHero } from '@/widgets/home-hero';
import { HomePainMirror } from '@/widgets/home-pain-mirror';
import { HomeHowItWorks } from '@/widgets/home-how-it-works';
import { HomeScenariosGrid } from '@/widgets/home-scenarios-grid';
import { HomeAdvantages } from '@/widgets/home-advantages';
import { HomeFounderCards } from '@/widgets/home-founder-cards';
import { HomePricingCard } from '@/widgets/home-pricing-card';
import { FaqSection } from '@/widgets/faq-section';
import { FinalCtaSection } from '@/widgets/final-cta-section';
import { StickyCta } from '@/widgets/sticky-cta';
import { JsonLd } from '@/shared/ui';
import { buildBreadcrumbLd, buildSpeakableLd, buildWebSiteLd } from '@/shared/model/libs/jsonld';
import { routing } from '@/shared/model/libs/i18n/routing';
import { env } from '@/shared/model/libs/env';

export const HomePage = async () => {
  const locale = await getLocale();
  const tCommon = await getTranslations('Common');
  const tMeta = await getTranslations('MetaGlobal');

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const breadcrumbLd = buildBreadcrumbLd([
    { name: tCommon('breadcrumb.home'), url: `${siteUrl}/${locale}` },
  ]);
  const speakableLd = buildSpeakableLd(['h1', '.speakable']);
  const websiteLd = buildWebSiteLd({
    name: tMeta('siteName'),
    url: `${siteUrl}/${locale}`,
    description: tMeta('defaultDescription'),
    inLanguage: routing.locales,
  });

  return (
    <>
      <HomeHero />
      <HomePainMirror />
      <HomeScenariosGrid />
      <HomeAdvantages />
      <HomeHowItWorks />
      <HomeFounderCards />
      <HomePricingCard />
      <FaqSection namespace="HomePage.faq" />
      <FinalCtaSection waveColor="#f7f8f5" />
      <StickyCta />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={speakableLd} />
      <JsonLd data={websiteLd} />
    </>
  );
};
