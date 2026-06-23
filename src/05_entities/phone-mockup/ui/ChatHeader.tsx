import type { ReactNode } from 'react';
import { ChevronLeftIcon, LogoMark } from '@/shared/ui';

type TProps = {
  botName: string;
  /** Plain string for static use, or a ReactNode (e.g. a client component) for cycling status. */
  botStatus: ReactNode;
  /** Unread badge next to the back chevron. Hidden when 0 / undefined. */
  unreadCount?: number;
};

/**
 * Telegram chat header strip: back chevron with optional unread count,
 * bot title pill, brand avatar (SpeakMove logo mark).
 */
export const ChatHeader = ({ botName, botStatus, unreadCount }: TProps) => {
  const showUnread = typeof unreadCount === 'number' && unreadCount > 0;
  return (
    <div className="relative z-10 mt-13 flex items-center gap-2 px-3 pb-1">
      <div className="tg-pill-shadow flex flex-none items-center gap-1 rounded-full bg-tg-header-pill py-2 pl-2.5 pr-2">
        <ChevronLeftIcon size={13} className="text-ink" />
        {showUnread ? (
          <span className="grid h-4 w-4 place-items-center rounded-full bg-ink text-[0.625rem] font-bold leading-none text-white">
            {unreadCount}
          </span>
        ) : null}
      </div>

      <div className="tg-pill-shadow flex-1 rounded-full bg-tg-header-pill px-4 py-1.5 text-center">
        <div className="text-sm font-extrabold leading-tight">{botName}</div>
        <div className="text-[0.7rem] leading-tight text-tg-header-pill-muted">{botStatus}</div>
      </div>

      <div className="tg-pill-shadow grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full bg-white ring-2 ring-tg-header-pill">
        <LogoMark size={32} />
      </div>
    </div>
  );
};
