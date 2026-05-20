import Image from 'next/image';
import { DoodleWallpaper } from '../Icon/DoodleWallpaper';
import { ChatBubble } from './ChatBubble';
import { ChatHeader } from './ChatHeader';
import { ChatInputBar } from './ChatInputBar';
import { PhoneStatusBar } from './PhoneStatusBar';
import type { TPhoneMessage } from './types';

type TProps = {
  botName: string;
  botStatus: string;
  dateLabel: string;
  inputPlaceholder: string;
  micLabel: string;
  messages: TPhoneMessage[];
  /** Unread badge in the Telegram chat header. Hidden when 0/undefined. */
  unreadCount?: number;
  /** Hint that this mockup is the LCP candidate of the route — eagerly preloads the frame image. */
  priority?: boolean;
};

/**
 * Decorative iPhone 14 Pro mock-up of a Telegram chat with the bot.
 * The whole element is `aria-hidden` — purely visual storytelling.
 * Frame: real PNG overlay (public/brand/iphone-frame.png).
 * Body: status bar, chat header, dated message list (voice or text
 * bubbles), and the bottom input pill. Pages compose this with their
 * own overlays (floating cards, etc.) outside the frame.
 */
export const PhoneMockup = ({
  botName,
  botStatus,
  dateLabel,
  inputPlaceholder,
  micLabel,
  messages,
  unreadCount,
  priority = false,
}: TProps) => {
  return (
    <div className="phone-frame relative" aria-hidden="true">
      <Image
        src="/brand/iphone-frame.png"
        alt=""
        fill
        sizes="390px"
        aria-hidden="true"
        className="pointer-events-none z-20 select-none object-contain"
        unoptimized
        priority={priority}
      />

      <div className="phone-screen tg-screen-bg absolute flex flex-col overflow-hidden">
        <DoodleWallpaper />

        <PhoneStatusBar />

        <ChatHeader botName={botName} botStatus={botStatus} unreadCount={unreadCount} />

        <div className="relative z-10 flex flex-1 flex-col justify-end gap-1.5 px-5 pb-2">
          <div className="mb-1 flex justify-center">
            <span className="rounded-full bg-tg-date-pill px-3 py-[3px] text-[12px] font-semibold text-white backdrop-blur-sm">
              {dateLabel}
            </span>
          </div>
          {messages.map((message, idx) => (
            <ChatBubble key={idx} message={message} index={idx} />
          ))}
        </div>

        <ChatInputBar placeholder={inputPlaceholder} ariaLabel={micLabel} />
      </div>
    </div>
  );
};
