import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { PrivacyFeatureCard } from '@/entities/privacy-card';
import { ANCHORS } from '@/shared/config';
import type { TPrivacyCard } from '@/entities/privacy-card';

export const PrivacyFeatureGrid = async () => {
  const t = await getTranslations('HowItWorksPage.privacy');
  const tCommon = await getTranslations('Common');
  const cards = t.raw('cards') as unknown as TPrivacyCard[];

  return (
    <Section
      id={ANCHORS.privacy}
      ariaLabelledBy="privacy-heading"
      className="bg-surface px-5 py-12 md:py-16"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="privacy-heading"
          subtitle={t('subtitle')}
        />

        <ul
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label={tCommon('aria.privacyFeatures')}
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
};
