import { getLocale, getTranslations } from 'next-intl/server';
import { getList, getObject } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
import { buildBotUrl } from '@/shared/model/utils';
import { PricingCard } from '@/entities/pricing-card';
import { PriceToggle, type TPriceModeData } from '@/features/price-toggle';

type TPriceToggleMessages = { modes?: TPriceModeData[] };

export const HomePricingCard = async () => {
  const t = await getTranslations('HomePage.pricingCard');
  const locale = await getLocale();
  const features = getList<string>(t, 'features');

  const toggle = getObject<TPriceToggleMessages>(t, 'priceToggle');
  const modes = toggle?.modes ?? [];

  return (
    <Section id={ANCHORS.pricing} ariaLabelledBy="pricing-card-heading" className="py-12 md:py-16">
      <Container>
        <PricingCard
          size="split"
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
          footnote={t('footnote')}
          priceSlot={<PriceToggle modes={modes} defaultMode="day" />}
        />
      </Container>
    </Section>
  );
};
