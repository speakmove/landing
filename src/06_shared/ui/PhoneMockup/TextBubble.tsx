import { cn } from '@/shared/model/libs/cn';
import { BubbleTail } from '../Icon/BubbleTail';
import { DoubleCheckIcon } from '../Icon/DoubleCheck';
import { InlineMarkdown } from '../InlineMarkdown';
import { BUBBLE_TIMESTAMP } from './constants';
import type { TPhoneMessage } from './types';

type TProps = {
  message: TPhoneMessage;
};

/**
 * Regular Telegram-style text bubble. Body is rendered with InlineMarkdown
 * so callers can highlight corrections using **bold**, ~~strikethrough~~,
 * `code` and links.
 */
export const TextBubble = ({ message }: TProps) => {
  const isMe = message.from === 'me';

  return (
    <div className={isMe ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={cn(
          'tg-bubble-shadow relative max-w-[88%] rounded-card px-3 py-2',
          isMe ? 'rounded-br-[3px] bg-tg-bubble-me' : 'rounded-bl-[3px] bg-white',
        )}
      >
        <BubbleTail
          side={isMe ? 'right' : 'left'}
          fill={isMe ? 'var(--color-tg-bubble-me)' : 'white'}
          className={isMe ? 'absolute -right-2 bottom-0' : 'absolute -left-2 bottom-0'}
        />
        <div
          className={cn(
            'text-13 leading-snug',
            isMe ? 'text-tg-bubble-me-ink' : 'text-tg-bubble-bot-ink',
          )}
        >
          <InlineMarkdown text={message.text} />
        </div>
        <span
          className={cn(
            'mt-1 inline-flex items-center gap-0.5 justify-end self-end whitespace-nowrap text-mini leading-none float-right ml-2',
            isMe ? 'text-tg-bubble-me-accent' : 'text-tg-timestamp-muted',
          )}
        >
          {BUBBLE_TIMESTAMP}
          {isMe ? (
            <DoubleCheckIcon size={14} className="text-tg-bubble-me-accent" />
          ) : null}
        </span>
      </div>
    </div>
  );
};
