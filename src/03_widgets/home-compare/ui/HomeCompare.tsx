import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import { ANCHORS } from '@/shared/config';
import type { TComparisonRow, TComparisonValue } from '@/entities/comparison-row';

const renderValue = (val: TComparisonValue, isHighlight: boolean) => {
  if (val.kind === 'check') {
    return (
      <span
        className={cn(
          'text-lg font-bold leading-none',
          isHighlight ? 'text-primary-ink' : 'text-primary',
        )}
        aria-hidden="true"
      >
        ✓
      </span>
    );
  }
  if (val.kind === 'cross') {
    return (
      <span className="text-lg leading-none text-faint" aria-hidden="true">
        —
      </span>
    );
  }
  if (val.kind === 'partial') {
    return <span className="text-muted">{val.text}</span>;
  }
  return <span>{val.text}</span>;
};

export const HomeCompare = async () => {
  const t = await getTranslations('HomePage.compare');

  const columns = t.raw('columns') as unknown as string[];
  const rows = t.raw('rows') as unknown as TComparisonRow[];
  const highlightColumn = t('highlightColumn');

  const highlightIdx = columns.indexOf(highlightColumn);

  return (
    <Section
      id={ANCHORS.compare}
      ariaLabelledBy="compare-heading"
      className="px-5"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="compare-heading"
          subtitle={t.has('subtitle') ? t('subtitle') : undefined}
        />

        <div className="overflow-x-auto rounded-[18px] border border-line bg-white shadow-(--shadow-soft)">
          <table className="w-full min-w-180 border-collapse text-[14.5px]">
            <caption className="sr-only">{t('title')}</caption>
            <thead>
              <tr>
                {columns.map((col, colIdx) => (
                  <th
                    key={col + colIdx}
                    scope="col"
                    className={cn(
                      'border-b border-line px-3.5 py-4 text-[13px] font-bold',
                      colIdx === 0 ? 'bg-[#fafbf8] text-left' : 'text-center',
                      colIdx === highlightIdx
                        ? 'bg-primary-pale text-primary-ink'
                        : colIdx === 0
                          ? ''
                          : 'bg-[#fafbf8]',
                    )}
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
                  <tr key={row.feature}>
                    <th
                      scope="row"
                      className={cn(
                        'px-3.5 py-4 text-left font-medium text-muted',
                        !isLast && 'border-b border-line',
                      )}
                    >
                      {row.feature}
                    </th>
                    {row.values.map((val, valIdx) => {
                      const colIdx = valIdx + 1;
                      const isHighlight = colIdx === highlightIdx;
                      const isCheck = val.kind === 'check';
                      const isCross = val.kind === 'cross';
                      return (
                        <td
                          key={valIdx}
                          className={cn(
                            'px-3.5 py-4 text-center',
                            !isLast && 'border-b border-line',
                            isHighlight && 'bg-primary-pale font-bold text-primary-ink',
                            !isHighlight && isCheck && 'font-bold text-primary',
                            !isHighlight && isCross && 'text-faint',
                          )}
                        >
                          {renderValue(val, isHighlight)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-5 max-w-[66%] text-center text-[10px] leading-[1.7] text-faint">
          {t('footnote')}
        </p>
      </Container>
    </Section>
  );
};
