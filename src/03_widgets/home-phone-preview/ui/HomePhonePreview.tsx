import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { DoodleWallpaper } from '@/shared/ui';
import type { TPhoneFloatBubble, TPhoneMessage } from '../model/types';
import { ChatHeader } from './ChatHeader';
import { ChatBubble } from './ChatBubble';
import { ChatInputBar } from './ChatInputBar';
import { FloatingBubbleCards } from './FloatingBubbleCards';
import { PhoneStatusBar } from './PhoneStatusBar';

/**
 * Decorative iPhone 14 Pro mock-up of a Telegram chat with the bot.
 * The whole element is `aria-hidden` — purely visual storytelling for the hero.
 * Frame: real PNG image overlay (public/brand/iphone-frame.png).
 * Content: composed from focused sub-components in this widget.
 */
export const HomePhonePreview = async () => {
  const t = await getTranslations('HomePage.hero.phonePreview');

  const botName = t('botName');
  const botStatus = t('botStatus');
  const coinBalance = t('coinBalance');
  const today = t('today');
  const inputPlaceholder = t('inputPlaceholder');
  const micLabel = t('micLabel');
  const messages = t.raw('messages') as unknown as TPhoneMessage[];
  const floatBubbles = t.raw('floatBubbles') as unknown as TPhoneFloatBubble[];

  return (
    <div className="relative mx-auto w-full max-w-[390px]" aria-hidden="true">
      <div className="phone-frame relative">
        <Image
          src="/brand/iphone-frame.png"
          alt=""
          fill
          sizes="390px"
          aria-hidden="true"
          className="pointer-events-none z-20 select-none object-contain"
          unoptimized
        />

        <div className="phone-screen tg-screen-bg absolute flex flex-col overflow-hidden">
          <DoodleWallpaper />

          <PhoneStatusBar />

          <ChatHeader botName={botName} botStatus={botStatus} coinBalance={coinBalance} />

          <div className="relative z-10 flex flex-1 flex-col justify-end gap-1.5 px-5 pb-2">
            <div className="mb-1 flex justify-center">
              <span className="rounded-full bg-[#5d8a47]/85 px-3 py-[3px] text-[12px] font-semibold text-white backdrop-blur-sm">
                {today}
              </span>
            </div>
            {messages.map((message, idx) => (
              <ChatBubble key={idx} message={message} index={idx} />
            ))}
          </div>

          <ChatInputBar placeholder={inputPlaceholder} ariaLabel={micLabel} />
        </div>
      </div>

      <FloatingBubbleCards bubbles={floatBubbles} />
    </div>
  );
};
