import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section, SectionHead } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { ANCHORS } from '@/shared/config';
import { ScenariosWheel } from '@/features/scenario-wheel';
import type { TScenarioRowProps } from '@/features/scenario-wheel';
import type { TScenarioCard } from '../model/types';

/**
 * HomeScenariosGrid — RSC.
 *
 * Fetches translations + locale, builds serialisable row props (including
 * pre-built bot URLs), then delegates rendering to the `ScenariosWheel`
 * client island. This keeps data-fetching in the server layer and
 * animation code in the client layer (feature slice).
 */
export const HomeScenariosGrid = async () => {
  const t = await getTranslations('HomePage.scenariosGrid');
  const tCommon = await getTranslations('Common');
  const locale = await getLocale();
  const cards = getList<TScenarioCard>(t, 'cards');
  const ctaLabel = t('ctaLabel');

  const rows: TScenarioRowProps[] = cards.map((card, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: card.title,
    aiRole: card.aiRole,
    hook: card.hook,
    duration: card.duration,
    href: buildBotUrl(locale, card.id),
    ariaLabel: `${ctaLabel} — ${card.title}`,
  }));

  return (
    <Section
      id={ANCHORS.scenarios}
      ariaLabelledBy="scenarios-grid-heading"
      tone="soft"
      className="py-14 md:py-20"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="scenarios-grid-heading"
          subtitle={t('subtitle')}
        />

        <ScenariosWheel rows={rows} ariaLabel={tCommon('aria.scenariosList')} />
      </Container>
    </Section>
  );
};
