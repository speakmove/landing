import { ChevronLeftIcon } from '../Icon';

type TProps = {
  botName: string;
  botStatus: string;
  coinBalance?: string;
};

/**
 * Telegram chat header strip: back chevron with unread count, bot title pill, avatar.
 * `coinBalance` is rendered inside the avatar circle when provided — used for the
 * home-hero mockup where a small visual badge sits in the corner. Empty by default.
 */
export const ChatHeader = ({ botName, botStatus, coinBalance = '' }: TProps) => {
  return (
    <div className="relative z-10 mt-13 flex items-center gap-2 px-3 pb-1">
      <div className="tg-pill-shadow flex flex-none items-center gap-1 rounded-full bg-tg-header-pill py-2 pl-2.5 pr-2">
        <ChevronLeftIcon size={13} className="text-ink" />
        <span className="grid h-4 w-4 place-items-center rounded-full bg-ink text-[0.625rem] font-bold leading-none text-white">
          2
        </span>
      </div>

      <div className="tg-pill-shadow flex-1 rounded-full bg-tg-header-pill px-4 py-1.5 text-center">
        <div className="text-sm font-extrabold leading-tight">{botName}</div>
        <div className="text-[0.7rem] leading-tight text-tg-header-pill-muted">{botStatus}</div>
      </div>

      <div className="tg-pill-shadow tg-avatar-purple grid h-10 w-10 flex-none place-items-center rounded-full ring-2 ring-tg-header-pill">
        <span className="text-xs font-extrabold text-white">{coinBalance}</span>
      </div>
    </div>
  );
};
