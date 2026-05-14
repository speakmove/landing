import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { FaqItem } from '@/entities/faq-item';
import type { TFaqItem } from '@/entities/faq-item';

export const PricingFaqSection = async () => {
  const t = await getTranslations('PricingPage.faq');
  const items = t.raw('items') as unknown as TFaqItem[];

  return (
    <Section id="faq" ariaLabelledBy="faq-heading">
      <Container>
        <div className="mb-8 max-w-150">
          <span className="inline-block mb-3 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('kicker')}
          </span>
          <h2
            id="faq-heading"
            className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-2"
          >
            {t('title')}
          </h2>
          <p className="text-base text-muted leading-relaxed">
            {t('subtitle')}{' '}
            <a
              href={`mailto:${t('contactEmail')}`}
              className="text-primary underline decoration-dotted hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
