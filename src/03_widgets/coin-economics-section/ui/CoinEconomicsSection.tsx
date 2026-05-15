import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
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
    <Section
      id={ANCHORS.coinEconomics}
      ariaLabelledBy="coin-economics-heading"
      className="px-5 py-12 md:py-20"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="coin-economics-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[18px] border border-line bg-white p-6 shadow-(--shadow-soft)">
            <h3 className="m-0 mb-4 text-base font-bold tracking-[-0.01em] text-ink">
              {t('earn.title')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">{t('earn.title')}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="pb-2 text-left font-semibold text-muted">
                      {tCommon('table.action')}
                    </th>
                    <th scope="col" className="pb-2 text-right font-semibold text-muted">
                      {tCommon('table.coins')}
                    </th>
                    <th scope="col" className="pb-2 text-right font-semibold text-muted">
                      USD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earnRows.map((row) => (
                    <tr key={row.what} className="border-b border-line last:border-0">
                      <td className="py-2.5 text-ink">{row.what}</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-primary">
                        {row.amount}
                      </td>
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
            <p className="mt-4 text-xs leading-relaxed text-muted">{t('earn.note')}</p>
          </div>

          <div className="flex flex-col gap-5 rounded-[18px] border border-line bg-white p-6 shadow-(--shadow-soft)">
            <h3 className="text-base font-bold tracking-[-0.01em] text-ink">
              {t('withdraw.title')}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-[2.4rem] font-extrabold leading-none tracking-tight text-gold">
                {t('withdraw.rateBig')}
              </span>
              <span className="text-sm text-muted">{t('withdraw.rateLabel')}</span>
            </div>

            <p className="rounded-lg bg-surface px-3 py-2 font-mono text-xs text-muted">
              {t('withdraw.conversion')}
            </p>

            <dl className="grid grid-cols-2 gap-3">
              {withdrawGrid.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {item.label}
                  </dt>
                  <dd className="text-xs font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="mb-2 text-xs font-semibold text-muted">
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

            <div className="rounded-xl border border-gold bg-gold-pale px-4 py-3 text-xs leading-relaxed text-ink">
              <span className="font-bold">{t('withdraw.callout.label')}</span>{' '}
              {t('withdraw.callout.text')}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
