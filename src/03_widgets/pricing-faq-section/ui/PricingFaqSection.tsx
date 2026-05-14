import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { FaqItem } from '@/entities/faq-item';
import { ANCHORS } from '@/shared/config';
import type { TFaqItem } from '@/entities/faq-item';

export const PricingFaqSection = async () => {
  const t = await getTranslations('PricingPage.faq');
  const tCommon = await getTranslations('Common');
  const items = t.raw('items') as unknown as TFaqItem[];

  return (
    <Section
      id={ANCHORS.faq}
      ariaLabelledBy="faq-heading"
      className="bg-surface px-5 py-12 md:py-20"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="faq-heading"
          subtitle={t('subtitle')}
        />

        <p className="-mt-6 mb-8 text-center text-sm text-muted">
          <a
            href={`mailto:${t('contactEmail')}`}
            className="text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('contactEmail')}
          </a>
        </p>

        <ul
          className="mx-auto max-w-[800px] list-none p-0"
          aria-label={tCommon('aria.faqList')}
        >
          {items.map((item) => (
            <FaqItem key={item.id} item={item} />
          ))}
        </ul>
      </Container>
    </Section>
  );
};
