import { BubbleTail } from '@/shared/ui';

type TProps = {
  label: string;
};

/**
 * "Bot is recording…" indicator rendered as a small bot-side bubble at
 * the bottom of the chat. Three pulsing dots (motion-safe — they freeze
 * under prefers-reduced-motion thanks to the global media query in
 * globals.css).
 */
export const TypingIndicator = ({ label }: TProps) => {
  return (
    <div className="flex flex-col items-start">
      <span className="mb-1 inline-flex items-center gap-1 px-1 font-mono text-[0.625rem] font-bold uppercase tracking-wider text-tg-bubble-bot-muted">
        {label}
      </span>
      <div className="tg-bubble-shadow relative inline-flex items-center gap-1.5 rounded-card rounded-bl-[3px] bg-white px-3 py-2.5">
        <BubbleTail side="left" fill="white" className="absolute -left-2 bottom-0" />
        <span className="tg-typing-dot block h-1.5 w-1.5 rounded-full bg-tg-bubble-bot-muted" />
        <span className="tg-typing-dot tg-typing-dot--2 block h-1.5 w-1.5 rounded-full bg-tg-bubble-bot-muted" />
        <span className="tg-typing-dot tg-typing-dot--3 block h-1.5 w-1.5 rounded-full bg-tg-bubble-bot-muted" />
      </div>
    </div>
  );
};
