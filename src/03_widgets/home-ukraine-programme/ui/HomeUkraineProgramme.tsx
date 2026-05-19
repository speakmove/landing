import { getTranslations } from 'next-intl/server';
import { ButtonLink, CheckIcon, Container, Section } from '@/shared/ui';
import { ANCHORS, PATHS } from '@/shared/config';

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
  const tableHeader = t.raw('tableHeader') as { label: string; standard: string; ua: string };

  const prices = t.raw('prices') as unknown as TPrice[];
  const features = t.raw('features') as unknown as string[];
  const qualification = t.raw('qualification') as unknown as TQualification;

  return (
    <Section
      id={ANCHORS.ukraine}
      ariaLabelledBy="ukraine-heading"
      className="py-16 md:py-22"
    >
      <Container>
        <div className="mx-auto max-w-190">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label={t('flagAriaLabel')}>
              {t('flag')}
            </span>
            <span className="section-eyebrow !mb-0">{t('kicker')}</span>
          </div>

          <h2
            id="ukraine-heading"
            className="h-display-sub mb-3 font-extrabold leading-[1.1] tracking-[-0.02em] text-ink"
          >
            {t('title')}
          </h2>
          <p className="mb-8 text-base leading-relaxed text-muted">{t('subtitle')}</p>

          <div className="mb-8 overflow-hidden rounded-card border border-line bg-white shadow-(--shadow-soft)">
            <h3 className="border-b border-line bg-surface-soft px-4 py-3 text-sm font-bold text-ink">
              {t('pricesTitle')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-120 border-collapse text-sm">
                <caption className="sr-only">{t('pricesTitle')}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="border-b border-line px-4 py-3 text-left font-semibold text-muted">
                      {tableHeader.label}
                    </th>
                    <th scope="col" className="border-b border-line px-4 py-3 text-center font-semibold text-muted">
                      {tableHeader.standard}
                    </th>
                    <th scope="col" className="border-b border-line bg-primary-pale px-4 py-3 text-center font-bold text-primary-ink">
                      {tableHeader.ua}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price, i) => {
                    const isLast = i === prices.length - 1;
                    return (
                      <tr key={price.label}>
                        <th
                          scope="row"
                          className={`px-4 py-3 text-left font-medium text-ink ${
                            isLast ? '' : 'border-b border-line'
                          }`}
                        >
                          {price.label}
                        </th>
                        <td
                          className={`px-4 py-3 text-center text-muted ${
                            isLast ? '' : 'border-b border-line'
                          }`}
                        >
                          {price.standard}
                        </td>
                        <td
                          className={`bg-primary-pale px-4 py-3 text-center font-bold text-primary-ink ${
                            isLast ? '' : 'border-b border-line'
                          }`}
                        >
                          {price.ua}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="mb-8 flex flex-col gap-2.5">
            {features.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-14-5 text-ink">
                <CheckIcon size={15} strokeWidth={3} className="mt-0.5 flex-none text-primary" />
                {feat}
              </li>
            ))}
          </ul>

          <div className="mb-8 rounded-card border border-line bg-white p-5 shadow-(--shadow-soft)">
            <h3 className="mb-3 text-sm font-bold text-ink">{qualification.title}</h3>
            <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
              {qualification.items.map((item, i) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-mini font-bold text-white">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <p className="mb-7 text-xs leading-relaxed italic text-muted">{t('disclaimer')}</p>

          <ButtonLink href={PATHS.waitlist} variant="primary" size="lg">
            {t('cta')}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
};
