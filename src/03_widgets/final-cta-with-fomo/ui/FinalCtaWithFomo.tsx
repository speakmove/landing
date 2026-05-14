import { getTranslations } from 'next-intl/server';
import { ButtonLink, Container, Section } from '@/shared/ui';
import { PATHS, ANCHORS } from '@/shared/config';

type TProps = {
  namespace?: string;
};

export const FinalCtaWithFomo = async ({ namespace = 'HomePage.finalCta' }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);

  const fomoCurrent = t.raw('fomo.current') as unknown as number;
  const fomoTotal = t.raw('fomo.total') as unknown as number;
  const pct = Math.min(100, Math.round((fomoCurrent / fomoTotal) * 1000) / 10);

  return (
    <Section
      id={ANCHORS.cta}
      ariaLabelledBy="final-cta-heading"
      className="px-5 py-16 md:py-22"
    >
      <Container>
        <div className="final-panel px-6 py-14 text-center sm:px-12 sm:py-16">
          <h2
            id="final-cta-heading"
            className="mx-0 mb-3.5 font-extrabold leading-[1.1] tracking-[-0.025em] text-ink"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('title')}
          </h2>
          <p className="mx-auto mb-7 max-w-[560px] text-[17px] leading-relaxed text-muted">
            {t('subtitle')}
          </p>

          <ButtonLink href={PATHS.waitlist} variant="primary" size="lg">
            {t('cta')}
          </ButtonLink>

          <div className="mt-4 text-[13.5px] text-muted">{t('meta')}</div>

          <div className="mx-auto mt-6 max-w-[480px]">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={fomoTotal}
              aria-valuenow={fomoCurrent}
              aria-label={t('fomo.label')}
              className="h-2.5 overflow-hidden rounded-full bg-[#eceee8]"
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-primary-hover"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs font-semibold text-muted">
              <span className="tabular-nums">
                {fomoCurrent} / {fomoTotal}
              </span>
              <span>{t('fomo.label')}</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
