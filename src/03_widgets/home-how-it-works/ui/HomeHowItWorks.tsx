import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section, SectionHead } from '@/shared/ui';
import { Reveal } from '@/features/reveal';
import { StepCard } from '@/entities/step-card';
import { ANCHORS } from '@/shared/config';
import type { TStep } from '@/entities/step-card';

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

        <Reveal variant="up">
          <ol className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.num}>
                <StepCard step={step} />
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
};
