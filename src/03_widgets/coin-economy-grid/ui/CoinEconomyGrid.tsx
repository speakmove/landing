import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { CoinFlowTable } from '@/entities/coin-flow-table';
import type { TCoinFlowRow } from '@/entities/coin-flow-table';

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
};

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
          <CoinFlowTable
            title={earn.title}
            rows={earn.rows}
            captionLabel={tCommon('table.earnCaption')}
            actionLabel={tCommon('table.action')}
            amountLabel={tCommon('table.amount')}
          />
          <div className="flex flex-col gap-4">
            <CoinFlowTable
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
};
