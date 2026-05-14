import { getTranslations } from 'next-intl/server';
import { CheckIcon, Container, Section } from '@/shared/ui';

type TPrice = {
  label: string;
  standard: string;
  ua: string;
};

type TQualification = {
  title: string;
  items: string[];
};

export const HomeUkraineProgramme = async () => {
  const t = await getTranslations('HomePage.ukrainianProgramme');

  const prices = t.raw('prices') as unknown as TPrice[];
  const features = t.raw('features') as unknown as string[];
  const qualification = t.raw('qualification') as unknown as TQualification;

  return (
    <Section
      id="ukraine-programme"
      ariaLabelledBy="ukraine-heading"
      className="bg-surface"
    >
      <Container>
        <div className="max-w-190 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="text-3xl" role="img" aria-label="Прапор України">
              {t('flag')}
            </span>
            <span className="ml-3 inline-block mb-3 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              {t('kicker')}
            </span>
            <h2
              id="ukraine-heading"
              className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-3"
            >
              {t('title')}
            </h2>
            <p className="text-base text-muted leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Price comparison table */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-ink mb-3">
              {t('pricesTitle')}
            </h3>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full min-w-[480px] border-collapse text-xs">
                <caption className="sr-only">{t('pricesTitle')}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-2 px-3 text-left font-semibold text-muted">
                      {/* TODO(i18n): hoist to messages/ru.json HomePage.ukrainianProgramme.tableHeader.label */}
                      Тариф
                    </th>
                    <th scope="col" className="py-2 px-3 text-center font-semibold text-muted">
                      {/* TODO(i18n): hoist to messages/ru.json HomePage.ukrainianProgramme.tableHeader.standard */}
                      Стандарт
                    </th>
                    <th scope="col" className="py-2 px-3 text-center font-bold text-primary">
                      {/* TODO(i18n): hoist to messages/ru.json HomePage.ukrainianProgramme.tableHeader.ua */}
                      Для України
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price, i) => (
                    <tr
                      key={i}
                      className="border-b border-line last:border-0"
                    >
                      <th
                        scope="row"
                        className="py-2.5 px-3 text-left font-medium text-ink"
                      >
                        {price.label}
                      </th>
                      <td className="py-2.5 px-3 text-center text-muted">
                        {price.standard}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-primary">
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
                <li key={feat} className="flex items-start gap-2 text-sm text-ink">
                  <CheckIcon size={15} className="mt-0.5 text-primary shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Qualification steps */}
          <div className="mb-8 rounded-2xl border border-line bg-white p-5">
            <h3 className="text-sm font-bold text-ink mb-3">
              {qualification.title}
            </h3>
            <ol className="flex flex-col gap-2 list-none p-0 m-0">
              {qualification.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer */}
          <p className="mb-7 text-xs italic text-muted leading-relaxed">
            {t('disclaimer')}
          </p>

          {/* CTA */}
          <a
            href="#cta"
            className="inline-flex min-h-13 items-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('cta')}
          </a>
        </div>
      </Container>
    </Section>
  );
}
