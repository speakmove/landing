import { getTranslations } from 'next-intl/server';
import { PhoneMockup } from '@/shared/ui';
import type { TPhoneFloatBubble, TPhoneMessage } from '@/shared/ui';
import { FloatingBubbleCards } from './FloatingBubbleCards';

/**
 * Home-hero phone mock — wraps the shared PhoneMockup composite and adds
 * floating brand bubbles outside the frame.
 */
export const HomePhonePreview = async () => {
  const t = await getTranslations('HomePage.hero.phonePreview');

  const messages = t.raw('messages') as unknown as TPhoneMessage[];
  const floatBubbles = t.raw('floatBubbles') as unknown as TPhoneFloatBubble[];

  return (
    <div className="relative mx-auto w-full max-w-[390px]" aria-hidden="true">
      <PhoneMockup
        botName={t('botName')}
        botStatus={t('botStatus')}
        dateLabel={t('today')}
        inputPlaceholder={t('inputPlaceholder')}
        micLabel={t('micLabel')}
        messages={messages}
      />
      <FloatingBubbleCards bubbles={floatBubbles} />
    </div>
  );
};
