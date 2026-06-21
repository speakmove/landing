import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
import type { TStep } from '@/entities/step-card';
import { HowItWorksPhonePreview } from './HowItWorksPhonePreview';
import { FlowSteps } from './FlowSteps';

export const FlowSectionWithPhone = async () => {
  const t = await getTranslations('HowItWorksPage.flow');
  const tCommon = await getTranslations('Common');

  const steps = getList<TStep>(t, 'steps');

  return (
    <Section id={ANCHORS.flow} ariaLabelledBy="flow-heading" tone="soft" className="py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="flow-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <FlowSteps steps={steps} ariaLabel={tCommon('aria.flowSteps')} />

          <div className="lg:sticky lg:top-[88px]">
            <HowItWorksPhonePreview />
          </div>
        </div>
      </Container>
    </Section>
  );
};
