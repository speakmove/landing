import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { URLS } from '@/shared/config';
import { PricingCard } from '@/entities/pricing-card';

export const PricingPlanCard = async () => {
  const t = await getTranslations('PricingPage.plan');
  const features = getList<string>(t, 'features');

  return (
    <Section ariaLabelledBy="plan-heading" className="py-10 md:py-14">
      <Container>
        <PricingCard
          size="compact"
          titleId="plan-heading"
          badge={t('badge')}
          title={t('name')}
          perDay={t('perDay')}
          perDayUnit={t('perDayUnit')}
          perMonth={t('perMonth')}
          subprice={t('subprice')}
          features={features}
          primaryCtaLabel={t('cta')}
          primaryCtaHref={URLS.telegramBot}
          footnote={t('footnote')}
        />
      </Container>
    </Section>
  );
};
