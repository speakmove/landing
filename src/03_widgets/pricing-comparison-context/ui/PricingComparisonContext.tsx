import { getTranslations } from 'next-intl/server';
import { getList, getObject } from '@/shared/model/libs/i18n/get-list';
import { Container, Reveal, Section, SectionHead } from '@/shared/ui';
import type { TMatrix, TRow } from '../model/types';
import { ComparisonMatrix } from './ComparisonMatrix';

export const PricingComparisonContext = async () => {
  const t = await getTranslations('PricingPage.comparison');
  const matrix = getObject<TMatrix>(t, 'matrix');

  if (!matrix) return null;

  const rows = getList<TRow>(t, 'matrix.rows');

  return (
    <Section ariaLabelledBy="comparison-heading" className="py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="comparison-heading"
        />

        <Reveal variant="scaleUp" className="mx-auto max-w-3xl">
          <ComparisonMatrix matrix={matrix} rows={rows} />
        </Reveal>

        <p className="mx-auto mt-7 max-w-2xl text-center text-pretty text-13 leading-relaxed text-muted">
          {t('closingLine')}
        </p>
      </Container>
    </Section>
  );
};
