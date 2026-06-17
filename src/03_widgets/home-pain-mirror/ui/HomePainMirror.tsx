import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { PainMirrorChat } from './PainMirrorChat';

type TLine = {
  text: string;
  scenarioId: string;
  scenarioLabel: string;
};

/**
 * Server component — fetches all translations and locale-aware bot URLs,
 * then delegates animated rendering to the PainMirrorChat client island.
 *
 * Pattern: RSC data shell → client animation island.
 * This keeps the data fetching on the server while enabling framer-motion.
 */
export const HomePainMirror = async () => {
  const t = await getTranslations('HomePage.painMirror');
  const locale = await getLocale();
  const lines = getList<TLine>(t, 'lines');
  const timeLabels = getList<string>(t, 'timeLabels');

  // Pre-build bot URLs on the server so the client island is pure presentational.
  const chipHrefs = lines.map((line) => buildBotUrl(locale, line.scenarioId));

  return (
    <Section
      ariaLabelledBy="pain-mirror-chat-heading"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <PainMirrorChat
          eyebrow={t('eyebrow')}
          heading={t('heading')}
          bridge={t('bridge')}
          botReply={t('botReply')}
          lines={lines}
          timeLabels={timeLabels}
          chipHrefs={chipHrefs}
        />
      </Container>
    </Section>
  );
};
