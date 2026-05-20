import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { PhoneMockup } from '@/shared/ui';
import type { TPhoneMessage } from '@/shared/ui';

/**
 * Phone mock for the /how-it-works flow section. Re-uses the same iPhone
 * frame and Telegram chat chrome as the home hero, but the body is a
 * richer AI-coach dialogue: voice messages from both sides plus text
 * bubbles for the correction and the praise (Falabola/Maku pattern —
 * strikethrough wrong, bold right, brief native-language explanation).
 */
export const HowItWorksPhonePreview = async () => {
  const t = await getTranslations('HowItWorksPage.flow.phonePreview');
  const messages = getList<TPhoneMessage>(t, 'messages');
  const unreadCount = t.has('unreadCount')
    ? (t.raw('unreadCount') as unknown as number)
    : undefined;

  return (
    <div className="relative mx-auto w-full max-w-[390px]" aria-hidden="true">
      <PhoneMockup
        botName={t('botName')}
        botStatus={t('botStatus')}
        dateLabel={t('today')}
        inputPlaceholder={t('inputPlaceholder')}
        micLabel={t('micLabel')}
        messages={messages}
        unreadCount={unreadCount}
      />
    </div>
  );
};
