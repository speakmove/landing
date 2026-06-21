import { getLocale, getTranslations } from 'next-intl/server';
import { getList, getObject } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { PricingCard } from '@/entities/pricing-card';
import { PriceToggle, type TPriceModeData } from '@/features/price-toggle';

type TPriceToggleMessages = { modes?: TPriceModeData[] };

export const PricingPlanCard = async () => {
  const t = await getTranslations('PricingPage.plan');
  const locale = await getLocale();
  const features = getList<string>(t, 'features');

  const toggle = getObject<TPriceToggleMessages>(t, 'priceToggle');
  const modes = toggle?.modes ?? [];

  return (
    <Section ariaLabelledBy="plan-heading" className="py-10 md:py-14">
      <Container>
        <PricingCard
          size="split"
          titleId="plan-heading"
          badge={t('badge')}
          title={t('name')}
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
