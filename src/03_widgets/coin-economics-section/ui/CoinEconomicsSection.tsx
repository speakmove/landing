import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import type { TCoinFlowRow } from '@/entities/coin-flow-table';
import type { TGiftCardOption } from '@/entities/gift-card-option';

type TEarnTotal = {
  label: string;
  amount: string;
};

type TWithdrawGridItem = {
  label: string;
  value: string;
};

export const CoinEconomicsSection = async () => {
  const t = await getTranslations('PricingPage.coinEconomics');
  const tCommon = await getTranslations('Common');

  const earnRows = t.raw('earn.rows') as unknown as TCoinFlowRow[];
  const earnTotal = t.raw('earn.total') as unknown as TEarnTotal;
  const withdrawGrid = t.raw('withdraw.grid') as unknown as TWithdrawGridItem[];
  const routes = t.raw('withdraw.routes') as unknown as TGiftCardOption[];

  return (
    <Section id="coin-economics" ariaLabelledBy="coin-economics-heading">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center max-w-150 mx-auto">
          <span className="inline-block mb-3 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('kicker')}
          </span>
          <h2
            id="coin-economics-heading"
            className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-2"
          >
            {t('title')}
          </h2>
          <p className="text-base text-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* LEFT: Earn table */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-(--shadow-soft)">
            <h3 className="text-base font-bold text-ink mb-4">
              {t('earn.title')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">{t('earn.title')}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="pb-2 text-left font-semibold text-muted">{tCommon('table.action')}</th>
                    <th scope="col" className="pb-2 text-right font-semibold text-muted">{tCommon('table.coins')}</th>
                    <th scope="col" className="pb-2 text-right font-semibold text-muted">USD</th>
                  </tr>
                </thead>
                <tbody>
                  {earnRows.map((row) => (
                    <tr key={row.what} className="border-b border-line last:border-0">
                      <td className="py-2.5 text-ink">{row.what}</td>
                      <td className="py-2.5 text-right font-semibold text-primary">{row.amount}</td>
                      <td className="py-2.5 text-right text-muted">{row.usd}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-line">
                    <th scope="row" className="pt-3 text-left font-bold text-ink">
                      {earnTotal.label}
                    </th>
                    <td colSpan={2} className="pt-3 text-right font-bold text-ink">
                      {earnTotal.amount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted leading-relaxed">
              {t('earn.note')}
            </p>
          </div>

          {/* RIGHT: Withdraw panel */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-(--shadow-soft) flex flex-col gap-5">
            <h3 className="text-base font-bold text-ink">
              {t('withdraw.title')}
            </h3>

            {/* Rate display */}
            <div className="flex items-baseline gap-2">
              <span className="text-[2.4rem] font-extrabold text-gold tracking-tight leading-none">
                {t('withdraw.rateBig')}
              </span>
              <span className="text-sm text-muted">
                {t('withdraw.rateLabel')}
              </span>
            </div>

            {/* Conversion line */}
            <p className="text-xs font-mono text-muted bg-surface rounded-lg px-3 py-2">
              {t('withdraw.conversion')}
            </p>

            {/* 6-item grid */}
            <dl className="grid grid-cols-2 gap-3">
              {withdrawGrid.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {item.label}
                  </dt>
                  <dd className="text-xs font-semibold text-ink">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Routes */}
            <div>
              <p className="text-xs font-semibold text-muted mb-2">
                {t('withdraw.routesTitle')}
              </p>
              <ul className="flex flex-wrap gap-2">
                {routes.map((route) => (
                  <li
                    key={route.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink"
                  >
                    <span aria-hidden="true">{route.flag}</span>
                    {route.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Callout box */}
            <div className="rounded-xl border border-gold bg-gold-pale px-4 py-3 text-xs text-ink leading-relaxed">
              <span className="font-bold">{t('withdraw.callout.label')}</span>{' '}
              {t('withdraw.callout.text')}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
