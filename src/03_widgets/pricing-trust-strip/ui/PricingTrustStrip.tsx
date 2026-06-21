import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { TrustPills } from './TrustPills';

/**
 * Trust strip rendered between the /pricing hero and the plan card.
 * Four inline pills carry the most reassuring properties of the offer
 * (free trial, no card, easy cancel, GDPR). Pulled from
 * PricingPage.trustStrip i18n.
 *
 * RSC shell: fetches copy + renders the semantic Section/Container/<ul>
 * (with aria-label) on the server. The individual floating pills are a
 * thin client island (TrustPills) so the motion lives only where needed.
 */
export const PricingTrustStrip = async () => {
  const t = await getTranslations('PricingPage.trustStrip');
  const items = getList<string>(t, 'items');

  return (
    <Section className="px-5 pt-0 pb-6 md:px-6 md:pt-0 md:pb-8">
      <Container>
        <ul
          className="m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 list-none p-0"
          aria-label={t('ariaLabel')}
        >
          <TrustPills items={items} />
        </ul>
      </Container>
    </Section>
  );
};
