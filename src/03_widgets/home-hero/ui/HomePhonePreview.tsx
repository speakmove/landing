import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { PhoneMockup } from '@/entities/phone-mockup';
import type { TPhoneFloatBubble, TPhoneMessage } from '@/entities/phone-mockup';
import { FloatingBubbleCards } from './FloatingBubbleCards';
import { RotatingStatus } from './RotatingStatus';

export const HomePhonePreview = async () => {
  const t = await getTranslations('HomePage.hero.phonePreview');

  const messages = getList<TPhoneMessage>(t, 'messages');
  const floatBubbles = getList<TPhoneFloatBubble>(t, 'floatBubbles');
  const botStatuses = getList<string>(t, 'botStatuses');
  const unreadCount = t.has('unreadCount')
    ? (t.raw('unreadCount') as unknown as number)
    : undefined;

  return (
    <div className="phone-preview-wrap phone-preview-wrap--compact" aria-hidden="true">
      <div className="phone-preview-inner">
        <PhoneMockup
          botName={t('botName')}
          botStatus={
            botStatuses.length > 0 ? (
              <RotatingStatus statuses={botStatuses} />
            ) : (
              t('botStatus')
            )
          }
          dateLabel={t('today')}
          inputPlaceholder={t('inputPlaceholder')}
          micLabel={t('micLabel')}
          messages={messages}
          unreadCount={unreadCount}
          priority
        />
        <FloatingBubbleCards bubbles={floatBubbles} />
      </div>
    </div>
  );
};
