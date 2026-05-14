import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';

type TCoinFlowRow = {
  what: string;
  amount: string;
};

type TEarnData = {
  title: string;
  rows: TCoinFlowRow[];
};

type TOutcomeData = {
  title: string;
  rows: TCoinFlowRow[];
  footnote: string;
};

/** Parse **bold** markdown inline — pure React JSX */
const BoldText = ({ text }: { text: string }) => {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const CoinTable = ({
  title,
  rows,
  captionLabel,
  actionLabel,
  amountLabel,
}: {
  title: string;
  rows: TCoinFlowRow[];
  captionLabel: string;
  actionLabel: string;
  amountLabel: string;
}) => {
  return (
    <div className="rounded-2xl border border-line bg-white shadow-(--shadow-soft) overflow-hidden">
      <div className="px-5 py-4 border-b border-line bg-surface">
        <h3 className="font-bold text-[17px] text-ink">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <caption className="sr-only">{captionLabel}</caption>
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted"
            >
              {actionLabel}
            </th>
            <th
              scope="col"
              className="px-5 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted"
            >
              {amountLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-line last:border-0 hover:bg-surface transition-colors"
            >
              <th
                scope="row"
                className="px-5 py-3 text-left font-normal text-ink"
              >
                {row.what}
              </th>
              <td className="px-5 py-3 text-right font-mono font-semibold text-primary-ink whitespace-nowrap">
                {row.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const CoinEconomyGrid = async () => {
  const t = await getTranslations('HowItWorksPage.coinLoop');
  const tCommon = await getTranslations('Common');
  const earn = t.raw('earn') as unknown as TEarnData;
  const outcome = t.raw('outcome') as unknown as TOutcomeData;

  return (
    <Section id="coin-loop" ariaLabelledBy="coin-loop-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-160 mb-10">
          <span className="inline-block mb-3 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('kicker')}
          </span>
          <h2
            id="coin-loop-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column tables */}
        <div className="grid md:grid-cols-2 gap-6">
          <CoinTable
            title={earn.title}
            rows={earn.rows}
            captionLabel={tCommon('table.earnCaption')}
            actionLabel={tCommon('table.action')}
            amountLabel={tCommon('table.amount')}
          />
          <div className="flex flex-col gap-4">
            <CoinTable
              title={outcome.title}
              rows={outcome.rows}
              captionLabel={tCommon('table.spendCaption')}
              actionLabel={tCommon('table.action')}
              amountLabel={tCommon('table.amount')}
            />
            {/* Footnote */}
            <p className="text-xs text-muted leading-relaxed italic px-1">
              <BoldText text={outcome.footnote} />
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
