'use client';

import { useTranslations } from 'next-intl';
import { Badge, Container, Section } from '@/shared/ui';

type TProps = {
  position?: number;
  bonusThreshold?: number;
};

export function SuccessBlockClient({ position, bonusThreshold = 15 }: TProps) {
  const t = useTranslations('ThankYouPage.hero');
  const eligible = typeof position === 'number' && position <= bonusThreshold;

  return (
    <Section>
      <Container className="max-w-[720px]">
        <div
          role="status"
          className="rounded-2xl border border-[color:var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-primary-pale)]">
            <svg
              className="h-8 w-8 text-[color:var(--color-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-[color:var(--color-muted)]">{t('subtitle')}</p>
          {typeof position === 'number' ? (
            <p className="mt-6 font-mono text-2xl font-bold text-[color:var(--color-primary)]">
              {t('positionTemplate', { position })}
            </p>
          ) : null}
          {eligible ? (
            <div className="mt-8 rounded-2xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-pale)] p-6 text-left">
              <Badge tone="gold">{t('bonusBlock.badge')}</Badge>
              <h2 className="mt-3 text-xl font-bold">{t('bonusBlock.title')}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-ink)]">{t('bonusBlock.text')}</p>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
