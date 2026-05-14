import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { SmartCriterionCard } from '@/entities/smart-criterion';
import type { TSmartCriterion } from '@/entities/smart-criterion';

export async function SmartCriteriaGrid() {
  const t = await getTranslations('HowItWorksPage.smart');
  const criteria = t.raw('criteria') as unknown as TSmartCriterion[];

  return (
    <Section id="smart" ariaLabelledBy="smart-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-160 mb-10">
          <span className="inline-block mb-3 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('kicker')}
          </span>
          <h2
            id="smart-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid: 1-col mobile, 2-col md, 3-col lg */}
        <ul
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Критерии SMART"
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
}
