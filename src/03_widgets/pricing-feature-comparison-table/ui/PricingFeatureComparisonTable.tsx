import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
import { TableThead } from './TableThead';
import { TableTbody } from './TableTbody';
import type { TComparisonValue } from '@/entities/comparison-row';

type TCompareRow = {
  feature: string;
  values: [TComparisonValue, TComparisonValue, TComparisonValue];
};

type TCompareGroup = {
  name: string;
  rows: TCompareRow[];
};

type TCompareData = {
  kicker: string;
  title: string;
  subtitle: string;
  columns: [string, string, string, string];
  highlightColumn: string;
  groups: TCompareGroup[];
};

export const PricingFeatureComparisonTable = async () => {
  const t = await getTranslations('PricingPage.compare');
  const tCommon = await getTranslations('Common');
  const data = {
    kicker: t('kicker'),
    title: t('title'),
    subtitle: t('subtitle'),
    columns: t.raw('columns') as unknown as [string, string, string, string],
    highlightColumn: t('highlightColumn'),
    groups: t.raw('groups') as unknown as TCompareGroup[],
  } satisfies TCompareData;

  const colHeaders = data.columns.slice(1) as [string, string, string];

  return (
    <Section
      id={ANCHORS.compare}
      ariaLabelledBy="compare-heading"
      className="bg-surface px-5 py-12 md:py-20"
    >
      <Container>
        <SectionHead
          kicker={data.kicker}
          title={data.title}
          titleId="compare-heading"
          subtitle={data.subtitle}
        />

        <div className="overflow-x-auto rounded-[18px] border border-line bg-white shadow-(--shadow-soft)">
          <table className="w-full min-w-180 border-collapse text-[14.5px]">
            <caption className="sr-only">{data.title}</caption>
            <TableThead
              featureColLabel={data.columns[0] || tCommon('table.feature')}
              colHeaders={colHeaders}
              highlightColumn={data.highlightColumn}
            />
            <TableTbody
              groups={data.groups}
              colHeaders={colHeaders}
              highlightColumn={data.highlightColumn}
            />
          </table>
        </div>
      </Container>
    </Section>
  );
};
