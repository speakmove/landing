import { BubbleTail, DoubleCheckIcon, InlineMarkdown, PlayIcon, WaveformBars } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import type { TPhoneMessage } from '../model/types';
import { buildWaveformBars } from '../model/waveform';

type TProps = {
  message: TPhoneMessage;
  index: number;
  timestamp: string;
};

/**
 * Telegram-style chat bubble. Renders one of two shapes:
 *   voice    — play button + waveform + duration (default)
 *   feedback — text bubble with markdown highlights (no play button)
 *
 * `from: 'me' | 'bot'` controls alignment and accent colours.
 * BubbleTail is the only absolute-positioned element (it sits outside the bubble edge).
 */
export const ChatBubble = ({ message, index, timestamp }: TProps) => {
  const isMe = message.from === 'me';
  const isFeedback = message.kind === 'feedback';

  const accentText = isMe ? 'text-tg-bubble-me-accent' : 'text-tg-bubble-bot-accent';

  return (
    <div className={isMe ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
      {message.label ? (
        <span
          className={cn(
            'mb-1 inline-flex items-center gap-1 px-1 font-mono text-[0.625rem] font-bold uppercase tracking-wider',
            isFeedback ? 'text-tg-bubble-bot-accent' : isMe ? 'text-tg-bubble-me-accent' : 'text-tg-bubble-bot-accent',
          )}
        >
          <span aria-hidden="true">{isFeedback ? '✎' : '🎙'}</span>
          {message.label}
        </span>
      ) : null}

      <div
        className={cn(
          'tg-bubble-shadow relative max-w-[88%] rounded-card px-3 py-2',
          isMe ? 'rounded-br-[3px] bg-tg-bubble-me' : 'rounded-bl-[3px] bg-white',
          isFeedback && !isMe ? 'border-l-2 border-tg-bubble-bot-accent' : '',
        )}
      >
        <BubbleTail
          side={isMe ? 'right' : 'left'}
          fill={isMe ? 'var(--color-tg-bubble-me)' : 'white'}
          className={isMe ? 'absolute -right-2 bottom-0' : 'absolute -left-2 bottom-0'}
        />

        {isFeedback ? <FeedbackBody message={message} isMe={isMe} /> : <VoiceBody message={message} isMe={isMe} index={index} />}

        <span
          className={cn(
            'mt-1.5 inline-flex items-center gap-0.5 self-end whitespace-nowrap text-[0.6875rem] leading-none float-right ml-2',
            isMe ? accentText : 'text-tg-timestamp-muted',
          )}
        >
          {timestamp}
          {isMe ? <DoubleCheckIcon size={14} className="text-tg-bubble-me-accent" /> : null}
        </span>
      </div>
    </div>
  );
};

const VoiceBody = ({
  message,
  isMe,
  index,
}: {
  message: TPhoneMessage;
  isMe: boolean;
  index: number;
}) => {
  const seed = (index + 1) * 7;
  const bars = buildWaveformBars(seed);
  const duration = message.duration ?? (isMe ? '0:08' : '0:11');
  const accentText = isMe ? 'text-tg-bubble-me-accent' : 'text-tg-bubble-bot-accent';
  const accentDot = isMe ? 'bg-tg-bubble-me-accent' : 'bg-tg-bubble-bot-accent';
  const barFill = isMe ? 'fill-tg-bubble-me-accent' : 'fill-tg-bubble-bot-accent';

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'grid h-11 w-11 flex-none place-items-center rounded-full text-white',
          isMe ? 'tg-play-me' : 'tg-play-bot',
        )}
      >
        <PlayIcon size={30} />
      </span>

      <div className="flex flex-col items-start gap-1">
        <WaveformBars bars={bars} className={cn('block', barFill)} />
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium leading-none',
            accentText,
          )}
        >
          {duration}
          <span className={cn('block h-1 w-1 rounded-full', accentDot)} />
        </span>
      </div>
    </div>
  );
};

const FeedbackBody = ({ message, isMe }: { message: TPhoneMessage; isMe: boolean }) => {
  return (
    <div className="max-w-65">
      <p
        className={cn(
          'm-0 text-[0.8125rem] leading-snug',
          isMe ? 'text-tg-bubble-me-ink' : 'text-tg-bubble-bot-ink',
        )}
      >
        <InlineMarkdown text={message.text} />
      </p>
      {message.translation ? (
        <p
          className={cn(
            'mt-1.5 m-0 text-[0.6875rem] leading-snug',
            isMe ? 'text-tg-bubble-me-accent' : 'text-tg-bubble-bot-muted',
          )}
        >
          {message.translation}
        </p>
      ) : null}
    </div>
  );
};
