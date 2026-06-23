import { getTranslations } from 'next-intl/server';
import { getList, getObject } from '@/shared/model/libs/i18n/get-list';
import { Container, Reveal, Section, SectionHead } from '@/shared/ui';
import { UnitEconomicsChart } from './UnitEconomicsChart';
import type { TLegendRow } from '../model/types';

type TRow = { label: string; amount: string };
type TTotal = { label: string; amount: string };

// Total monthly price the £9.90 split is computed against.
const PRICE_TOTAL = 9.9;

// Percentage of the £9.90 total a money amount represents (fixed data).
const toPercent = (amount: number): string =>
  Number.isFinite(amount) ? `${Math.round((amount / PRICE_TOTAL) * 100)}%` : '';

export const PricingUnitEconomics = async () => {
  const t = await getTranslations('PricingPage.unitEconomics');

  const currency = t('currency');
  const rows = getList<TRow>(t, 'rows');
  const costTotal = getObject<TTotal>(t, 'costTotal');
  const margin = getObject<TTotal>(t, 'margin');

  if (!costTotal || !margin) return null;

  // Build the unified legend in light-up order, each row tagged with the
  // cumulative £ threshold at which it ignites as the counter sweeps 0 → 9.90.
  // Cost rows: threshold = running cumulative cost. Subtotal lights with the
  // last cost row (same cumulative). Margin lights at the full total.
  const valueOf = (amount: string): number => {
    const value = Number.parseFloat(amount);
    return Number.isFinite(value) ? value : 0;
  };

  const costRows: TLegendRow[] = rows.reduce<TLegendRow[]>((acc, row) => {
    const prev = acc.at(-1)?.threshold ?? 0;
    const threshold = prev + valueOf(row.amount);
    acc.push({
      label: row.label,
      amount: row.amount,
      percent: toPercent(valueOf(row.amount)),
      threshold,
      kind: 'cost',
    });
    return acc;
  }, []);

  // Total cost spent so far = the last cost row's cumulative threshold.
  const costCumulative = costRows.at(-1)?.threshold ?? 0;

  const legend: TLegendRow[] = [
    ...costRows,
    {
      label: costTotal.label,
      amount: costTotal.amount,
      percent: toPercent(valueOf(costTotal.amount)),
      // Lights right after the last cost row (same cumulative cost).
      threshold: costCumulative,
      kind: 'subtotal',
    },
    {
      label: margin.label,
      amount: margin.amount,
      percent: toPercent(valueOf(margin.amount)),
      // Lights only when the counter reaches the full total.
      threshold: PRICE_TOTAL,
      kind: 'margin',
    },
  ];

  return (
    <Section
      ariaLabelledBy="unit-economics-heading"
      className="bg-surface py-12 md:py-16"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="unit-economics-heading"
          subtitle={t('subtitle')}
        />

        {/* Outer Reveal scales the container in gently; the ring draw-in,
            counter, and legend light-up are driven by the client island's
            in-view rAF (see UnitEconomicsChart / useUnitEconomicsDraw). */}
        <Reveal variant="scaleUp">
          <UnitEconomicsChart
            currency={currency}
            kicker={t('kicker')}
            rows={legend}
            total={PRICE_TOTAL}
          />
        </Reveal>

        <p className="mx-auto mt-8 max-w-2xl text-pretty text-14-5 leading-relaxed text-muted">
          {t('bottomLine')}
        </p>
      </Container>
    </Section>
  );
};
