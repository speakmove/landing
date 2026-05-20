import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { ANCHORS, PATHS, URLS } from '@/shared/config';
import { PricingCard } from '@/entities/pricing-card';

export const HomePricingCard = async () => {
  const t = await getTranslations('HomePage.pricingCard');
  const features = getList<string>(t, 'features');

  return (
    <Section id={ANCHORS.pricing} ariaLabelledBy="pricing-card-heading" className="py-12 md:py-16">
      <Container>
        <PricingCard
          size="wide"
          titleId="pricing-card-heading"
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
          perDay={t('perDay')}
          perDayUnit={t('perDayUnit')}
          perMonth={t('perMonth')}
          features={features}
          primaryCtaLabel={t('cta')}
          primaryCtaHref={URLS.telegramBot}
          secondaryLink={{ label: t('seeDetailsLabel'), href: PATHS.pricing }}
          footnote={t('footnote')}
        />
      </Container>
    </Section>
  );
};
