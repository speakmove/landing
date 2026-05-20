import { cn } from '@/shared/model/libs/cn';
import { BubbleTail } from '../Icon/BubbleTail';
import { DoubleCheckIcon } from '../Icon/DoubleCheck';
import { PlayIcon } from '../Icon/Play';
import { WaveformBars } from '../Icon/WaveformBars';
import { InlineMarkdown } from '../InlineMarkdown';
import { buildWaveformBars } from './waveform';
import type { TPhoneMessage } from './types';

type TProps = {
  message: TPhoneMessage;
  index: number;
};

/**
 * Single chat bubble. Two visual shapes are supported:
 *   voice — Telegram-style play + waveform + duration (default).
 *   text  — regular Telegram text bubble. Body is rendered with
 *           InlineMarkdown so callers can highlight corrections using
 *           **bold**, ~~strikethrough~~ and `code`.
 *
 * `from: 'me' | 'bot'` controls alignment and accent colours.
 */
export const ChatBubble = ({ message, index }: TProps) => {
  if (message.kind === 'text') {
    return <TextBubble message={message} />;
  }
  return <VoiceBubble message={message} index={index} />;
};

const TIMESTAMP = '11:00 AM';

const VoiceBubble = ({ message, index }: { message: TPhoneMessage; index: number }) => {
  const isMe = message.from === 'me';
  const seed = (index + 1) * 7;
  const bars = buildWaveformBars(seed);
  const duration = message.duration ?? (isMe ? '0:08' : '0:11');
  const accentText = isMe ? 'text-tg-bubble-me-accent' : 'text-tg-bubble-bot-accent';
  const accentDot = isMe ? 'bg-tg-bubble-me-accent' : 'bg-tg-bubble-bot-accent';
  const barFill = isMe ? 'fill-tg-bubble-me-accent' : 'fill-tg-bubble-bot-accent';

  return (
    <div className={isMe ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={cn(
          'tg-bubble-shadow relative flex max-w-[88%] flex-col gap-1.5 rounded-card px-3 py-2',
          isMe ? 'rounded-br-[3px] bg-tg-bubble-me' : 'rounded-bl-[3px] bg-white',
        )}
      >
        <BubbleTail
          side={isMe ? 'right' : 'left'}
          fill={isMe ? 'var(--color-tg-bubble-me)' : 'white'}
          className={isMe ? 'absolute -right-2 bottom-0' : 'absolute -left-2 bottom-0'}
        />

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

        <span
          className={cn(
            'inline-flex items-center gap-0.5 self-end whitespace-nowrap text-[0.6875rem] leading-none',
            isMe ? 'text-tg-bubble-me-accent' : 'text-tg-timestamp-muted',
          )}
        >
          {TIMESTAMP}
          <DoubleCheckIcon size={14} className="text-tg-bubble-me-accent" />
        </span>
      </div>
    </div>
  );
};

const TextBubble = ({ message }: { message: TPhoneMessage }) => {
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
            'text-[0.8125rem] leading-snug',
            isMe ? 'text-tg-bubble-me-ink' : 'text-tg-bubble-bot-ink',
          )}
        >
          <InlineMarkdown text={message.text} />
        </div>
        <span
          className={cn(
            'mt-1 inline-flex items-center gap-0.5 justify-end self-end whitespace-nowrap text-[0.6875rem] leading-none float-right ml-2',
            isMe ? 'text-tg-bubble-me-accent' : 'text-tg-timestamp-muted',
          )}
        >
          {TIMESTAMP}
          {isMe ? <DoubleCheckIcon size={14} className="text-tg-bubble-me-accent" /> : null}
        </span>
      </div>
    </div>
  );
};
