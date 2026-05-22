import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { Reveal } from '@/features/reveal';
import { ANCHORS, PATHS } from '@/shared/config';
import { buildBotUrl } from '@/shared/model/utils';
import { PricingCard } from '@/entities/pricing-card';

export const HomePricingCard = async () => {
  const t = await getTranslations('HomePage.pricingCard');
  const locale = await getLocale();
  const features = getList<string>(t, 'features');

  return (
    <Section id={ANCHORS.pricing} ariaLabelledBy="pricing-card-heading" className="py-12 md:py-16">
      <Container>
        <Reveal variant="rise">
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
            primaryCtaHref={buildBotUrl(locale)}
            secondaryLink={{ label: t('seeDetailsLabel'), href: PATHS.pricing }}
            footnote={t('footnote')}
          />
        </Reveal>
      </Container>
    </Section>
  );
};
