import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import type { TComparisonRow } from '@/entities/comparison-row';

export async function HomeCompare() {
  const t = await getTranslations('HomePage.compare');

  const columns = t.raw('columns') as unknown as string[];
  const rows = t.raw('rows') as unknown as TComparisonRow[];
  const highlightColumn = t('highlightColumn');

  // Find the index of the SpeakMove column (the highlighted one)
  const highlightIdx = columns.indexOf(highlightColumn);

  return (
    <Section
      id="compare"
      ariaLabelledBy="compare-heading"
      className="bg-[color:var(--color-surface)]"
    >
      <Container>
        <div className="mb-10 max-w-[640px]">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-white px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="compare-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
          >
            {t('title')}
          </h2>
        </div>

        {/* Horizontal scroll wrapper for mobile */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[640px] border-collapse text-[14px]">
            <caption className="sr-only">{t('title')}</caption>
            <thead>
              <tr>
                {columns.map((col, colIdx) => (
                  <th
                    key={colIdx}
                    scope="col"
                    className={[
                      'py-3 px-4 text-left font-bold whitespace-nowrap',
                      colIdx === 0 ? 'w-[200px] text-[color:var(--color-muted)]' : '',
                      colIdx === highlightIdx
                        ? 'text-[color:var(--color-primary)] bg-[color:var(--color-primary-pale)] rounded-t-xl border-x border-t border-[color:var(--color-primary)]'
                        : 'text-[color:var(--color-ink)] border-b border-[color:var(--color-line)]',
                    ].join(' ')}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => {
                const isLast = rowIdx === rows.length - 1;
                return (
                  <tr
                    key={rowIdx}
                    className="border-b border-[color:var(--color-line)] last:border-0"
                  >
                    <th
                      scope="row"
                      className="py-3 px-4 font-medium text-left text-[color:var(--color-ink)] whitespace-nowrap"
                    >
                      {row.feature}
                    </th>
                    {row.values.map((val, valIdx) => {
                      const colIdx = valIdx + 1; // offset by 1 because col[0] is the feature label
                      const isHighlight = colIdx === highlightIdx;
                      return (
                        <td
                          key={valIdx}
                          className={[
                            'py-3 px-4 text-center',
                            isHighlight
                              ? [
                                  'font-semibold text-[color:var(--color-primary-ink)] bg-[color:var(--color-primary-pale)] border-x border-[color:var(--color-primary)]',
                                  isLast ? 'rounded-b-xl border-b' : '',
                                ].join(' ')
                              : 'text-[color:var(--color-muted)]',
                          ].join(' ')}
                        >
                          {val === 'Да' || val === 'Есть' || val === 'Полный' ? (
                            <span className="inline-flex items-center justify-center gap-1 text-[color:var(--color-primary)] font-semibold">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {val}
                            </span>
                          ) : val === '—' ? (
                            <span className="text-[color:var(--color-faint)]" aria-label="Недоступно">
                              —
                            </span>
                          ) : (
                            val
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <p className="mt-5 text-[12px] text-[color:var(--color-muted)] leading-relaxed">
          {t('footnote')}
        </p>
      </Container>
    </Section>
  );
}
