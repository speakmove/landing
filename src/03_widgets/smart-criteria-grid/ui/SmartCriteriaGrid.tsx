import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { SmartCriterionCard } from '@/entities/smart-criterion';
import { ANCHORS } from '@/shared/config';
import type { TSmartCriterion } from '@/entities/smart-criterion';

export const SmartCriteriaGrid = async () => {
  const t = await getTranslations('HowItWorksPage.smart');
  const tCommon = await getTranslations('Common');
  const criteria = t.raw('criteria') as unknown as TSmartCriterion[];

  return (
    <Section id={ANCHORS.smart} ariaLabelledBy="smart-heading" className="bg-surface px-5 py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="smart-heading"
          subtitle={t('subtitle')}
        />

        <ul
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label={tCommon('aria.smartCriteria')}
        >
          {criteria.map((criterion) => (
            <li key={criterion.letter} className="contents">
              <SmartCriterionCard criterion={criterion} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
