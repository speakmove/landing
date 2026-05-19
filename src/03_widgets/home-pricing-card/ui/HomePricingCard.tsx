import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { ArrowRightIcon, CheckIcon, Container, Section } from '@/shared/ui';
import { ANCHORS, PATHS, URLS } from '@/shared/config';

export const HomePricingCard = async () => {
  const t = await getTranslations('HomePage.pricingCard');
  const features = t.raw('features') as unknown as string[];

  return (
    <Section id={ANCHORS.pricing} ariaLabelledBy="pricing-card-heading" className="py-12 md:py-16">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-card-lg border border-line bg-white p-7 text-center shadow-(--shadow-soft) md:p-10">
          <span className="inline-flex items-center rounded-full bg-primary-pale px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary-ink">
            {t('badge')}
          </span>

          <h2
            id="pricing-card-heading"
            className="mt-3 m-0 text-balance text-3xl font-extrabold tracking-tight text-ink md:text-4xl"
          >
            {t('title')}
          </h2>

          <p className="mt-3 m-0 max-w-lg text-pretty text-15-5 leading-relaxed text-muted">
            {t('subtitle')}
          </p>

          <ul className="mt-6 m-0 grid list-none grid-cols-1 gap-2.5 p-0 text-left sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-14-5 leading-snug text-ink"
              >
                <CheckIcon size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={URLS.telegramBot}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              {t('cta')}
            </a>
            <Link
              href={PATHS.pricing}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5 transition-[gap] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('seeDetailsLabel')}
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <p className="mt-3 m-0 text-13 text-muted">{t('footnote')}</p>
        </div>
      </Container>
    </Section>
  );
};
