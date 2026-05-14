import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { FaqItem } from '@/entities/faq-item';
import type { TFaqItem } from '@/entities/faq-item';

export async function PricingFaqSection() {
  const t = await getTranslations('PricingPage.faq');
  const items = t.raw('items') as unknown as TFaqItem[];

  return (
    <Section id="faq" ariaLabelledBy="faq-heading">
      <Container>
        <div className="mb-8 max-w-[600px]">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="faq-heading"
            className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-2"
          >
            {t('title')}
          </h2>
          <p className="text-[16px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}{' '}
            <a
              href={`mailto:${t('contactEmail')}`}
              className="text-[color:var(--color-primary)] underline decoration-dotted hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
            >
              {t('contactEmail')}
            </a>
          </p>
        </div>

        <ul className="max-w-[800px]" aria-label="Частые вопросы">
          {items.map((item) => (
            <FaqItem key={item.id} item={item} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
