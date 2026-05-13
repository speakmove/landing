import { getTranslations } from 'next-intl/server';
import { Badge, Container, Section, ArrowRightIcon } from '@/shared/ui';

type TProps = {
  namespace?: string;
};

export async function FinalCtaWithFomo({ namespace = 'HomePage.finalCta' }: TProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);

  const fomoCurrent = t.raw('fomo.current') as unknown as number;
  const fomoTotal = t.raw('fomo.total') as unknown as number;

  return (
    <Section
      id="cta"
      ariaLabelledBy="final-cta-heading"
      className="bg-[color:var(--color-primary-pale)]"
    >
      <Container>
        <div className="max-w-[640px] mx-auto text-center flex flex-col items-center gap-6">
          {/* Bonus callout */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge tone="gold">{t('bonus.badge')}</Badge>
            <span className="text-[14px] text-[color:var(--color-ink)] font-medium">
              {t('bonus.text')}
            </span>
          </div>

          {/* Title */}
          <h2
            id="final-cta-heading"
            className="text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-tight tracking-[-0.025em] text-[color:var(--color-ink)]"
          >
            {t('title')}
          </h2>

          {/* Subtitle */}
          <p className="text-[17px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}
          </p>

          {/* FOMO counter */}
          <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--color-primary)] bg-white px-5 py-2.5">
            <span
              className="relative flex h-2.5 w-2.5 shrink-0"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-primary)] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]" />
            </span>
            <span className="text-[14px] font-semibold text-[color:var(--color-ink)] tabular-nums">
              {fomoCurrent}
              <span className="text-[color:var(--color-muted)] font-normal">
                {' / '}{fomoTotal}
              </span>
            </span>
            <span className="text-[13px] text-[color:var(--color-muted)]">
              {/* TODO(i18n): hoist to messages/ru.json finalCta.fomo.label */}
              мест занято
            </span>
          </div>

          {/* CTA button */}
          <a
            href="https://t.me/speakmove_bot"
            rel="noopener noreferrer"
            className="inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-8 text-[17px] font-bold text-white shadow-[0_4px_14px_color-mix(in_oklab,var(--color-primary)_40%,transparent)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
          >
            {t('cta')}
            <ArrowRightIcon size={18} />
          </a>

          {/* Meta line */}
          <p className="text-[13px] text-[color:var(--color-muted)]">{t('meta')}</p>
        </div>
      </Container>
    </Section>
  );
}
