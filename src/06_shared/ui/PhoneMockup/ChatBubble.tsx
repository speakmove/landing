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
 *   voice       — Telegram-style play + waveform + duration (default).
 *   correction  — bot-side text bubble with a left accent stripe; text is
 *                 rendered with InlineMarkdown so callers can highlight
 *                 corrections using **bold**, ~~strikethrough~~ and `code`.
 *
 * `from: 'me' | 'bot'` controls alignment and accent colours.
 */
export const ChatBubble = ({ message, index }: TProps) => {
  if (message.kind === 'correction') {
    return <CorrectionBubble message={message} />;
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
    <div className={isMe ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
      {message.label ? (
        <span
          className={cn(
            'mb-1 inline-flex items-center gap-1 px-1 font-mono text-[0.625rem] font-bold uppercase tracking-wider',
            isMe ? 'text-tg-bubble-me-accent' : 'text-tg-bubble-bot-accent',
          )}
        >
          <span aria-hidden="true">🎙</span>
          {message.label}
        </span>
      ) : null}

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

const CorrectionBubble = ({ message }: { message: TPhoneMessage }) => {
  return (
    <div className="flex flex-col items-start">
      {message.label ? (
        <span className="mb-1 inline-flex items-center gap-1 px-1 font-mono text-[0.625rem] font-bold uppercase tracking-wider text-tg-bubble-bot-accent">
          <span aria-hidden="true">✎</span>
          {message.label}
        </span>
      ) : null}
      <div className="tg-bubble-shadow relative max-w-[88%] rounded-card rounded-bl-[3px] border-l-2 border-tg-bubble-bot-accent bg-white px-3 py-2.5">
        <BubbleTail side="left" fill="white" className="absolute -left-2 bottom-0" />
        <div className="text-[0.8125rem] leading-snug text-tg-bubble-bot-ink">
          <InlineMarkdown text={message.text} />
        </div>
        <span className="mt-2 block whitespace-nowrap text-right text-[0.6875rem] leading-none text-tg-timestamp-muted">
          {TIMESTAMP}
        </span>
      </div>
    </div>
  );
};
