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
function BoldText({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[color:var(--color-ink)]">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function CoinTable({
  title,
  rows,
  captionLabel,
}: {
  title: string;
  rows: TCoinFlowRow[];
  captionLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-white shadow-[var(--shadow-soft)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <h3 className="font-bold text-[17px] text-[color:var(--color-ink)]">{title}</h3>
      </div>
      <table className="w-full text-[14px]">
        <caption className="sr-only">{captionLabel}</caption>
        <thead>
          <tr className="border-b border-[color:var(--color-line)]">
            <th
              scope="col"
              className="px-5 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]"
            >
              Действие
            </th>
            <th
              scope="col"
              className="px-5 py-2.5 text-right text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]"
            >
              Сумма
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[color:var(--color-line)] last:border-0 hover:bg-[color:var(--color-surface)] transition-colors"
            >
              <th
                scope="row"
                className="px-5 py-3 text-left font-normal text-[color:var(--color-ink)]"
              >
                {row.what}
              </th>
              <td className="px-5 py-3 text-right font-mono font-semibold text-[color:var(--color-primary-ink)] whitespace-nowrap">
                {row.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function CoinEconomyGrid() {
  const t = await getTranslations('HowItWorksPage.coinLoop');
  const earn = t.raw('earn') as unknown as TEarnData;
  const outcome = t.raw('outcome') as unknown as TOutcomeData;

  return (
    <Section id="coin-loop" ariaLabelledBy="coin-loop-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-[640px] mb-10">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="coin-loop-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column tables */}
        <div className="grid md:grid-cols-2 gap-6">
          <CoinTable
            title={earn.title}
            rows={earn.rows}
            captionLabel="Таблица заработка монет SM"
          />
          <div className="flex flex-col gap-4">
            <CoinTable
              title={outcome.title}
              rows={outcome.rows}
              captionLabel="Таблица обмена монет SM на gift card"
            />
            {/* Footnote */}
            <p className="text-[13px] text-[color:var(--color-muted)] leading-relaxed italic px-1">
              <BoldText text={outcome.footnote} />
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
