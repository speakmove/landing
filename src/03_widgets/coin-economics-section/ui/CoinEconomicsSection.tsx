import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import type { TGiftCardOption } from '@/entities/gift-card-option';

type TEarnRow = {
  what: string;
  amount: string;
  usd: string;
};

type TEarnTotal = {
  label: string;
  amount: string;
};

type TWithdrawGridItem = {
  label: string;
  value: string;
};

export async function CoinEconomicsSection() {
  const t = await getTranslations('PricingPage.coinEconomics');

  const earnRows = t.raw('earn.rows') as unknown as TEarnRow[];
  const earnTotal = t.raw('earn.total') as unknown as TEarnTotal;
  const withdrawGrid = t.raw('withdraw.grid') as unknown as TWithdrawGridItem[];
  const routes = t.raw('withdraw.routes') as unknown as TGiftCardOption[];

  return (
    <Section id="coin-economics" ariaLabelledBy="coin-economics-heading">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center max-w-[600px] mx-auto">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="coin-economics-heading"
            className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-2"
          >
            {t('title')}
          </h2>
          <p className="text-[16px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* LEFT: Earn table */}
          <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-[16px] font-bold text-[color:var(--color-ink)] mb-4">
              {t('earn.title')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] border-collapse">
                <caption className="sr-only">{t('earn.title')}</caption>
                <thead>
                  <tr className="border-b border-[color:var(--color-line)]">
                    <th scope="col" className="pb-2 text-left font-semibold text-[color:var(--color-muted)]">Действие</th>
                    <th scope="col" className="pb-2 text-right font-semibold text-[color:var(--color-muted)]">Монеты</th>
                    <th scope="col" className="pb-2 text-right font-semibold text-[color:var(--color-muted)]">USD</th>
                  </tr>
                </thead>
                <tbody>
                  {earnRows.map((row) => (
                    <tr key={row.what} className="border-b border-[color:var(--color-line)] last:border-0">
                      <td className="py-2.5 text-[color:var(--color-ink)]">{row.what}</td>
                      <td className="py-2.5 text-right font-semibold text-[color:var(--color-primary)]">{row.amount}</td>
                      <td className="py-2.5 text-right text-[color:var(--color-muted)]">{row.usd}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[color:var(--color-line)]">
                    <th scope="row" className="pt-3 text-left font-bold text-[color:var(--color-ink)]">
                      {earnTotal.label}
                    </th>
                    <td colSpan={2} className="pt-3 text-right font-bold text-[color:var(--color-ink)]">
                      {earnTotal.amount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-[color:var(--color-muted)] leading-relaxed">
              {t('earn.note')}
            </p>
          </div>

          {/* RIGHT: Withdraw panel */}
          <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] flex flex-col gap-5">
            <h3 className="text-[16px] font-bold text-[color:var(--color-ink)]">
              {t('withdraw.title')}
            </h3>

            {/* Rate display */}
            <div className="flex items-baseline gap-2">
              <span className="text-[2.4rem] font-extrabold text-[color:var(--color-gold)] tracking-tight leading-none">
                {t('withdraw.rateBig')}
              </span>
              <span className="text-[15px] text-[color:var(--color-muted)]">
                {t('withdraw.rateLabel')}
              </span>
            </div>

            {/* Conversion line */}
            <p className="text-[13px] font-mono text-[color:var(--color-muted)] bg-[color:var(--color-surface)] rounded-lg px-3 py-2">
              {t('withdraw.conversion')}
            </p>

            {/* 6-item grid */}
            <dl className="grid grid-cols-2 gap-3">
              {withdrawGrid.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                    {item.label}
                  </dt>
                  <dd className="text-[13px] font-semibold text-[color:var(--color-ink)]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Routes */}
            <div>
              <p className="text-[13px] font-semibold text-[color:var(--color-muted)] mb-2">
                {t('withdraw.routesTitle')}
              </p>
              <ul className="flex flex-wrap gap-2">
                {routes.map((route) => (
                  <li
                    key={route.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3 py-1 text-[13px] font-medium text-[color:var(--color-ink)]"
                  >
                    <span aria-hidden="true">{route.flag}</span>
                    {route.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Callout box */}
            <div className="rounded-xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-pale)] px-4 py-3 text-[13px] text-[color:var(--color-ink)] leading-relaxed">
              <span className="font-bold">{t('withdraw.callout.label')}</span>{' '}
              {t('withdraw.callout.text')}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
