import { MicIcon, PaperclipIcon, StickerTabIcon } from '../Icon';

type TProps = {
  placeholder: string;
  ariaLabel: string;
};

/**
 * Bottom input bar — iOS 26 Liquid Glass style.
 * Three translucent capsules: paperclip, message field with sticker tab, mic.
 */
export const ChatInputBar = ({ placeholder, ariaLabel }: TProps) => {
  return (
    <div
      className="relative z-10 flex items-center gap-2 px-3 pb-4 pt-2"
      aria-label={ariaLabel}
    >
      <span className="tg-glass-pill grid h-10 w-10 flex-none place-items-center rounded-full bg-tg-input-pill text-tg-input-ink backdrop-blur-md">
        <PaperclipIcon size={20} />
      </span>

      <div className="tg-glass-pill flex h-10 flex-1 items-center justify-between gap-2 rounded-full bg-tg-input-pill pl-4 pr-3 backdrop-blur-md">
        <span className="truncate text-sm leading-none text-tg-input-muted">{placeholder}</span>
        <StickerTabIcon size={20} className="flex-none text-tg-input-muted" />
      </div>

      <span className="tg-glass-pill grid h-10 w-10 flex-none place-items-center rounded-full bg-tg-input-pill text-tg-input-ink backdrop-blur-md">
        <MicIcon size={20} strokeWidth={1.7} />
      </span>
    </div>
  );
};
