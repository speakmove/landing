import { getLocale, getTranslations } from 'next-intl/server';
import { PageHero } from '@/widgets/page-hero';
import { FlowSectionWithPhone } from '@/widgets/flow-section-with-phone';
import { PrivacyFeatureGrid } from '@/widgets/privacy-feature-grid';
import { FaqSection } from '@/widgets/faq-section';
import { FinalCtaSection } from '@/widgets/final-cta-section';
import { JsonLd } from '@/shared/ui';
import {
  buildBreadcrumbLd,
  buildHowToLd,
  buildSpeakableLd,
} from '@/shared/model/libs/jsonld';
import { env } from '@/shared/model/libs/env';
import { getList } from '@/shared/model/libs/i18n/get-list';

type TFlowStep = {
  num: string;
  title: string;
  description: string;
};

export const HowItWorksPage = async () => {
  const locale = await getLocale();
  const tNav = await getTranslations('HomePage.nav.links');
  const tHero = await getTranslations('HowItWorksPage.hero');
  const tFlow = await getTranslations('HowItWorksPage.flow');
  const tCommon = await getTranslations('Common');

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const steps = getList<TFlowStep>(tFlow, 'steps');

  const breadcrumbLd = buildBreadcrumbLd([
    { name: tCommon('breadcrumb.home'), url: `${siteUrl}/${locale}` },
    { name: tNav('howItWorks'), url: `${siteUrl}/${locale}/how-it-works` },
  ]);

  const howToLd = buildHowToLd({
    name: tHero('title'),
    description: tHero('description'),
    totalTime: 'PT15M',
    steps: steps.map((s) => ({ name: s.title, text: s.description })),
  });

  const speakableLd = buildSpeakableLd(['h1', '.speakable']);

  return (
    <>
      <PageHero namespace="HowItWorksPage.hero" decoration="waveform" />
      <FlowSectionWithPhone />
      <PrivacyFeatureGrid />
      <FaqSection namespace="HowItWorksPage.faq" />
      {/* FAQ above is the soft band → wave cap matches it (no seam). */}
      <FinalCtaSection namespace="HowItWorksPage.finalCta" waveColor="#f7f8f5" />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={speakableLd} />
    </>
  );
};
