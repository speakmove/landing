import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { CoinFlowTable } from '@/entities/coin-flow-table';
import { ANCHORS } from '@/shared/config';
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
        ),
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
    <Section id={ANCHORS.coinLoop} ariaLabelledBy="coin-loop-heading" className="px-5 py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="coin-loop-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid gap-6 md:grid-cols-2">
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
            <p className="px-1 text-xs leading-relaxed italic text-muted">
              <BoldText text={outcome.footnote} />
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};
