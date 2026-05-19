import { getTranslations } from 'next-intl/server';
import { Container } from '@/shared/ui';
import { PricingFaqSection } from '@/widgets/pricing-faq-section';
import { FinalCtaWithFomo } from '@/widgets/final-cta-with-fomo';

export const PricingPage = async () => {
  const t = await getTranslations('PricingPage.hero');

  return (
    <>
      <header className="relative overflow-hidden px-5 pt-16 pb-10 text-center md:px-6 md:pt-20">
        <div aria-hidden="true" className="page-hero-bg" />
        <Container>
          <div className="mx-auto max-w-190">
            <div className="section-eyebrow !mb-0">{t('crumb')}</div>
            <h1 className="h-display-page my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink">
              {t('title')}
            </h1>
            <p className="mx-auto max-w-160 text-pretty text-lg text-muted">
              {t('description')}
            </p>
          </div>
        </Container>
      </header>

      <PricingFaqSection />
      <FinalCtaWithFomo namespace="PricingPage.finalCta" />
    </>
  );
}
