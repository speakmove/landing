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
        <div className="mb-8 text-center max-w-[600px] mx-auto">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {data.kicker}
          </span>
          <h2
            id="compare-heading"
            className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-2"
          >
            {data.title}
          </h2>
          <p className="text-[16px] text-[color:var(--color-muted)] leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-line)]">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <caption className="sr-only">{data.title}</caption>
            <thead>
              <tr className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
                <th
                  scope="col"
                  className="py-3 px-4 text-left font-semibold text-[color:var(--color-muted)] w-[40%]"
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
                        ? 'text-[color:var(--color-gold)] bg-[color:var(--color-gold-pale)]'
                        : 'text-[color:var(--color-ink)]',
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
                    className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]"
                  >
                    <th
                      colSpan={4}
                      scope="colgroup"
                      className="py-2 px-4 text-left text-[12px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]"
                    >
                      {group.name}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-[color:var(--color-line)] last:border-0 even:bg-[color:var(--color-surface)]/40"
                    >
                      <th
                        scope="row"
                        className="py-3 px-4 text-left font-normal text-[color:var(--color-ink)]"
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
                                ? 'bg-[color:var(--color-gold-pale)]/30 text-[color:var(--color-ink)] font-medium'
                                : 'text-[color:var(--color-muted)]',
                              val === '—' ? 'text-[color:var(--color-muted)] opacity-40' : '',
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
