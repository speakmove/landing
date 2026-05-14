import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { TableThead } from './TableThead';
import { TableTbody } from './TableTbody';

type TCompareRow = {
  feature: string;
  values: [string, string, string];
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
    <Section id="compare" ariaLabelledBy="compare-heading">
      <Container>
        <div className="mb-8 text-center max-w-150 mx-auto">
          <span className="inline-block mb-3 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {data.kicker}
          </span>
          <h2
            id="compare-heading"
            className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-2"
          >
            {data.title}
          </h2>
          <p className="text-base text-muted leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] border-collapse text-sm">
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
