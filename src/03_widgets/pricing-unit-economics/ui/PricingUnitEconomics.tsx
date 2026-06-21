import { getTranslations } from 'next-intl/server';
import { getList, getObject } from '@/shared/model/libs/i18n/get-list';
import { Container, Reveal, Section, SectionHead } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';

type TRow = { label: string; amount: string };
type TTotal = { label: string; amount: string };

// Total monthly price the £9.90 split is computed against.
const PRICE_TOTAL = 9.9;

/**
 * Swatch background classes per donut segment, indexed by row position.
 * These tokens MUST match the conic-gradient stops in `.ue-donut`
 * (app/globals.css) so the legend reads as a key to the chart.
 * 5 cohesive emerald steps (dark → light) for the cost rows.
 */
const COST_SWATCH = [
  'bg-primary-ink', // STT — recognising speech (darkest)
  'bg-primary', // LLM — AI partner + feedback
  'bg-primary-hover', // TTS — voice synthesis (largest cost)
  'bg-emerald-400', // payment processing
  'bg-emerald-300', // hosting (lightest)
] as const;

// Percentage of the £9.90 total a money amount represents (fixed data).
const toPercent = (amount: string): string => {
  const value = Number.parseFloat(amount);
  if (!Number.isFinite(value)) return '';
  return `${Math.round((value / PRICE_TOTAL) * 100)}%`;
};

export const PricingUnitEconomics = async () => {
  const t = await getTranslations('PricingPage.unitEconomics');

  const currency = t('currency');
  const rows = getList<TRow>(t, 'rows');
  const costTotal = getObject<TTotal>(t, 'costTotal');
  const margin = getObject<TTotal>(t, 'margin');

  if (!costTotal || !margin) return null;

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

        <div className="mx-auto grid max-w-3xl items-center gap-10 md:grid-cols-[auto_1fr] md:gap-12">
          {/* Donut — decorative visualisation; real data is in the legend below */}
          <Reveal variant="scaleUp" className="justify-self-center">
            <div className="relative" aria-hidden="true">
              <div className="ue-donut" />
              <div className="ue-donut-center">
                <span className="ue-donut-total">
                  {currency}
                  {PRICE_TOTAL.toFixed(2)}
                </span>
                <span className="mt-1.5 text-12 font-medium uppercase tracking-wide text-faint">
                  {t('kicker')}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Legend — the accessible data table for the chart */}
          <ul className="flex flex-col gap-px overflow-hidden rounded-card border border-line bg-white shadow-(--shadow-soft)">
            {rows.map((row, i) => (
              <li
                key={row.label}
                className="flex items-center gap-3 px-4 py-3 odd:bg-surface-soft"
              >
                <span
                  className={cn(
                    'size-3 shrink-0 rounded-3',
                    COST_SWATCH[i] ?? 'bg-primary',
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 text-14-5 text-muted">
                  {row.label}
                </span>
                <span className="font-mono text-13 tabular-nums text-faint">
                  {toPercent(row.amount)}
                </span>
                <span className="w-16 text-right font-mono text-15 tabular-nums text-ink">
                  {currency}
                  {row.amount}
                </span>
              </li>
            ))}

            <li className="flex items-center gap-3 border-t-2 border-line bg-surface-soft px-4 py-3">
              <span className="size-3 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 text-14-5 font-bold text-ink">
                {costTotal.label}
              </span>
              <span className="font-mono text-13 tabular-nums text-faint">
                {toPercent(costTotal.amount)}
              </span>
              <span className="w-16 text-right font-mono text-15 font-bold tabular-nums text-ink">
                {currency}
                {costTotal.amount}
              </span>
            </li>

            <li className="flex items-center gap-3 bg-gold-pale px-4 py-3">
              <span
                className="size-3 shrink-0 rounded-3 bg-gold-accent"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 text-14-5 font-bold text-gold-deep">
                {margin.label}
              </span>
              <span className="font-mono text-13 tabular-nums text-gold-mid">
                {toPercent(margin.amount)}
              </span>
              <span className="w-16 text-right font-mono text-15 font-bold tabular-nums text-gold-deep">
                {currency}
                {margin.amount}
              </span>
            </li>
          </ul>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-pretty text-14-5 leading-relaxed text-muted">
          {t('bottomLine')}
        </p>
      </Container>
    </Section>
  );
};
