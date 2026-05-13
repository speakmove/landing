import { getTranslations } from 'next-intl/server';
import { Badge, CheckIcon, Container, Section } from '@/shared/ui';

type TPrice = {
  label: string;
  standard: string;
  ua: string;
};

type TQualification = {
  title: string;
  items: string[];
};

export async function HomeUkraineProgramme() {
  const t = await getTranslations('HomePage.ukrainianProgramme');

  const prices = t.raw('prices') as unknown as TPrice[];
  const features = t.raw('features') as unknown as string[];
  const qualification = t.raw('qualification') as unknown as TQualification;

  return (
    <Section
      id="ukraine-programme"
      ariaLabelledBy="ukraine-heading"
      className="bg-[color:var(--color-surface)]"
    >
      <Container>
        <div className="max-w-[760px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="text-3xl" role="img" aria-label="Прапор України">
              {t('flag')}
            </span>
            <span className="ml-3 inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-white px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
              {t('kicker')}
            </span>
            <h2
              id="ukraine-heading"
              className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
            >
              {t('title')}
            </h2>
            <p className="text-[16px] text-[color:var(--color-muted)] leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Price comparison table */}
          <div className="mb-8">
            <h3 className="text-[15px] font-bold text-[color:var(--color-ink)] mb-3">
              {t('pricesTitle')}
            </h3>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full min-w-[480px] border-collapse text-[13px]">
                <caption className="sr-only">{t('pricesTitle')}</caption>
                <thead>
                  <tr className="border-b border-[color:var(--color-line)]">
                    <th scope="col" className="py-2 px-3 text-left font-semibold text-[color:var(--color-muted)]">
                      {/* TODO(i18n): hoist to messages/ru.json HomePage.ukrainianProgramme.tableHeader.label */}
                      Тариф
                    </th>
                    <th scope="col" className="py-2 px-3 text-center font-semibold text-[color:var(--color-muted)]">
                      {/* TODO(i18n): hoist to messages/ru.json HomePage.ukrainianProgramme.tableHeader.standard */}
                      Стандарт
                    </th>
                    <th scope="col" className="py-2 px-3 text-center font-bold text-[color:var(--color-primary)]">
                      {/* TODO(i18n): hoist to messages/ru.json HomePage.ukrainianProgramme.tableHeader.ua */}
                      Для України
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price, i) => (
                    <tr
                      key={i}
                      className="border-b border-[color:var(--color-line)] last:border-0"
                    >
                      <th
                        scope="row"
                        className="py-2.5 px-3 text-left font-medium text-[color:var(--color-ink)]"
                      >
                        {price.label}
                      </th>
                      <td className="py-2.5 px-3 text-center text-[color:var(--color-muted)]">
                        {price.standard}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-[color:var(--color-primary)]">
                        {price.ua}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Features list */}
          <div className="mb-8">
            <ul className="flex flex-col gap-2">
              {features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-[14px] text-[color:var(--color-ink)]">
                  <CheckIcon size={15} className="mt-0.5 text-[color:var(--color-primary)] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Qualification steps */}
          <div className="mb-8 rounded-2xl border border-[color:var(--color-line)] bg-white p-5">
            <h3 className="text-[15px] font-bold text-[color:var(--color-ink)] mb-3">
              {qualification.title}
            </h3>
            <ol className="flex flex-col gap-2 list-none p-0 m-0">
              {qualification.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-[color:var(--color-ink)]">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[color:var(--color-primary)] text-white text-[11px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer */}
          <p className="mb-7 text-[12px] italic text-[color:var(--color-muted)] leading-relaxed">
            {t('disclaimer')}
          </p>

          {/* CTA */}
          <a
            href="#cta"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-8 text-base font-semibold text-white transition-colors hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
          >
            {t('cta')}
          </a>
        </div>
      </Container>
    </Section>
  );
}
