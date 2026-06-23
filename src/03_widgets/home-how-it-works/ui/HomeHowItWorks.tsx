import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
import type { TStep } from '@/entities/step-card';
import { HowItWorksTimeline } from './HowItWorksTimeline';

export const HomeHowItWorks = async () => {
  const t = await getTranslations('HomePage.howItWorks');

  const steps = getList<TStep>(t, 'steps');

  return (
    <Section id={ANCHORS.howItWorks} ariaLabelledBy="how-it-works-heading">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="how-it-works-heading"
          subtitle={t('subtitle')}
        />

        <HowItWorksTimeline steps={steps} />
      </Container>
    </Section>
  );
};
