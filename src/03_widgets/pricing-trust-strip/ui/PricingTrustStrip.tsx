import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { CheckIcon, Container, Section } from '@/shared/ui';

/**
 * Trust strip rendered between the /pricing hero and the plan card.
 * Four inline pills carry the most reassuring properties of the offer
 * (free trial, no card, easy cancel, GDPR). Pulled from
 * PricingPage.trustStrip i18n.
 */
export const PricingTrustStrip = async () => {
  const t = await getTranslations('PricingPage.trustStrip');
  const items = getList<string>(t, 'items');

  return (
    <Section className="px-5 py-2 md:px-6">
      <Container>
        <ul
          className="m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 list-none p-0"
          aria-label={t('ariaLabel')}
        >
          {items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-13 font-medium text-ink shadow-(--shadow-soft)"
            >
              <CheckIcon size={14} strokeWidth={3} className="shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
