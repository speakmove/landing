import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, JsonLd, Section, SectionHead } from '@/shared/ui';
import { FaqItem } from '@/entities/faq-item';
import { ANCHORS } from '@/shared/config';
import { buildFaqLd } from '@/shared/model/libs/jsonld';
import type { TFaqItem } from '@/entities/faq-item';

type TProps = {
  namespace: string;
};

export const FaqSection = async ({ namespace }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);
  const tCommon = await getTranslations('Common');
  const items = getList<TFaqItem>(t, 'items');

  const faqLd = items.length > 0 ? buildFaqLd(items) : null;

  return (
    <Section
      id={ANCHORS.faq}
      ariaLabelledBy="faq-heading"
      className="py-12 md:py-20"
      tone="white"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="faq-heading"
          subtitle={t('subtitle')}
        />

        <p className="text-muted -mt-6 mb-8 text-center text-sm">
          <a
            href={`mailto:${t('contactEmail')}`}
            className="text-primary focus-visible:outline-primary underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('contactEmail')}
          </a>
        </p>

        <ul
          className="mx-auto flex max-w-200 list-none flex-col gap-2.5 p-0"
          aria-label={tCommon('aria.faqList')}
        >
          {items.map((item) => (
            <FaqItem key={item.id} item={item} />
          ))}
        </ul>
      </Container>
      {faqLd ? <JsonLd data={faqLd} /> : null}
    </Section>
  );
};
