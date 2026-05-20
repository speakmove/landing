import { getTranslations } from 'next-intl/server';
import { getList, getObject } from '@/shared/model/libs/i18n/get-list';
import { Container, Section, SectionHead } from '@/shared/ui';

type TRow = { label: string; amount: string };
type TTotal = { label: string; amount: string };

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

        <div className="mx-auto max-w-2xl overflow-hidden rounded-card border border-line bg-white shadow-(--shadow-soft)">
          <table className="w-full border-collapse text-left">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-15 font-normal text-muted"
                  >
                    {row.label}
                  </th>
                  <td className="px-5 py-3.5 text-right font-mono text-15 tabular-nums text-ink">
                    {currency}
                    {row.amount}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-line bg-surface-soft">
                <th
                  scope="row"
                  className="px-5 py-3.5 text-15 font-bold text-ink"
                >
                  {costTotal.label}
                </th>
                <td className="px-5 py-3.5 text-right font-mono text-15 font-bold tabular-nums text-ink">
                  {currency}
                  {costTotal.amount}
                </td>
              </tr>
              <tr className="bg-primary-pale">
                <th
                  scope="row"
                  className="px-5 py-3.5 text-15 font-bold text-primary-ink"
                >
                  {margin.label}
                </th>
                <td className="px-5 py-3.5 text-right font-mono text-15 font-bold tabular-nums text-primary-ink">
                  {currency}
                  {margin.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-14-5 leading-relaxed text-muted">
          {t('bottomLine')}
        </p>
      </Container>
    </Section>
  );
};
