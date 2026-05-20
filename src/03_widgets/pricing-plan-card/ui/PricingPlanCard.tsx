import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { CheckIcon, Container, Section } from '@/shared/ui';
import { URLS } from '@/shared/config';

export const PricingPlanCard = async () => {
  const t = await getTranslations('PricingPage.plan');

  const features = getList<string>(t, 'features');

  return (
    <Section ariaLabelledBy="plan-heading" className="py-10 md:py-14">
      <Container>
        <article className="mx-auto flex max-w-md flex-col rounded-card-lg border border-line bg-white p-7 shadow-(--shadow-soft) md:p-10">
          <header className="text-center">
            <span className="inline-flex items-center rounded-full bg-primary-pale px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary-ink">
              {t('badge')}
            </span>
            <h2
              id="plan-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-ink"
            >
              {t('name')}
            </h2>

            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-extrabold tracking-tight text-primary-ink">
                {t('perDay')}
              </span>
              <span className="text-lg font-semibold text-muted">
                {t('perDayUnit')}
              </span>
            </div>
            <p className="mt-1.5 m-0 font-mono text-13-5 text-muted">
              {t('perMonth')}
            </p>
            <p className="mt-2 m-0 text-13 text-faint">{t('subprice')}</p>
          </header>

          <ul className="mt-7 m-0 list-none space-y-3 p-0">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-15-5 leading-snug text-ink">
                <CheckIcon size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href={URLS.telegramBot}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg mt-7 w-full"
          >
            {t('cta')}
          </a>
          <p className="mt-3 text-center text-13 text-muted">{t('footnote')}</p>
        </article>
      </Container>
    </Section>
  );
};
