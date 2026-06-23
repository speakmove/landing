import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { PhoneMockup } from '@/entities/phone-mockup';
import type { TPhoneFloatBubble, TPhoneMessage } from '@/entities/phone-mockup';
import { FloatingBubbleCards } from './FloatingBubbleCards';
import { PhoneTiltRig } from './PhoneTiltRig';
import { RotatingStatus } from './RotatingStatus';

/**
 * Hero phone preview (RSC).
 *
 * Structure:
 *   PhoneTiltRig (client — 3-D tilt rig: perspective + rotateX/Y via useTilt3d)
 *     phone-preview-wrap   (sizing / overflow)
 *       phone-preview-inner  (scale transform — phone content, 100% static)
 *         PhoneMockup        (static chat UI)
 *       FloatingBubbleCards  (client — fly-in + idle drift + translateZ lift)
 *
 * The tilt acts on the outer rig; the phone-preview-inner scale is nested inside
 * without conflict because it only controls 2-D uniform scale. The floating
 * cards sit outside phone-preview-inner (at phone-preview-wrap level) so their
 * absolute positions relative to the phone frame are unaffected by the scale.
 */
export const HomePhonePreview = async () => {
  const t = await getTranslations('HomePage.hero.phonePreview');

  const messages = getList<TPhoneMessage>(t, 'messages');
  const floatBubbles = getList<TPhoneFloatBubble>(t, 'floatBubbles');
  const botStatuses = getList<string>(t, 'botStatuses');
  const unreadCount = t.has('unreadCount')
    ? (t.raw('unreadCount') as unknown as number)
    : undefined;

  return (
    <PhoneTiltRig>
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
        </div>
        <FloatingBubbleCards bubbles={floatBubbles} />
      </div>
    </PhoneTiltRig>
  );
};
