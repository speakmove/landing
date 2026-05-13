import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { PrivacyFeatureCard } from '@/entities/privacy-card';
import type { TPrivacyCard } from '@/entities/privacy-card';

export async function PrivacyFeatureGrid() {
  const t = await getTranslations('HowItWorksPage.privacy');
  const cards = t.raw('cards') as unknown as TPrivacyCard[];

  return (
    <Section id="privacy" ariaLabelledBy="privacy-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-[640px] mb-10">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="privacy-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid: 1-col mobile, 2-col md, 3-col lg */}
        <ul
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Функции безопасности и приватности"
        >
          {cards.map((card) => (
            <li key={card.id} className="contents">
              <PrivacyFeatureCard card={card} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
