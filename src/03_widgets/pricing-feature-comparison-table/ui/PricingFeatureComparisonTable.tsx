import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';

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

export async function PricingFeatureComparisonTable() {
  const t = await getTranslations('PricingPage.compare');
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
            <thead>
              <tr className="border-b border-line bg-surface">
                <th
                  scope="col"
                  className="py-3 px-4 text-left font-semibold text-muted w-[40%]"
                >
                  {data.columns[0] || 'Функция'}
                </th>
                {colHeaders.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className={[
                      'py-3 px-4 text-center font-bold',
                      col === data.highlightColumn
                        ? 'text-gold bg-gold-pale'
                        : 'text-ink',
                    ].join(' ')}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.groups.map((group) => (
                <>
                  <tr
                    key={`group-${group.name}`}
                    className="border-b border-line bg-surface"
                  >
                    <th
                      colSpan={4}
                      scope="colgroup"
                      className="py-2 px-4 text-left text-xs font-bold uppercase tracking-wider text-muted"
                    >
                      {group.name}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-line last:border-0 even:bg-surface/40"
                    >
                      <th
                        scope="row"
                        className="py-3 px-4 text-left font-normal text-ink"
                      >
                        {row.feature}
                      </th>
                      {row.values.map((val, i) => {
                        const colName = colHeaders[i];
                        const isHighlight = colName === data.highlightColumn;
                        return (
                          <td
                            key={i}
                            className={[
                              'py-3 px-4 text-center',
                              isHighlight
                                ? 'bg-gold-pale/30 text-ink font-medium'
                                : 'text-muted',
                              val === '—' ? 'text-muted opacity-40' : '',
                            ].join(' ')}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
