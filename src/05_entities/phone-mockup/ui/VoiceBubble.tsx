import { cn } from '@/shared/model/libs/cn';
import { BubbleTail, DoubleCheckIcon, PlayIcon, WaveformBars } from '@/shared/ui';
import { buildWaveformBars } from '../model/waveform';
import { BUBBLE_TIMESTAMP } from '../model/constants';
import type { TPhoneMessage } from '../model/types';

type TProps = {
  message: TPhoneMessage;
  index: number;
};

/**
 * Telegram-style voice-message bubble: play button + waveform + duration.
 * Tail color matches the bubble background. Outgoing (me) bubbles use the
 * green me-accent palette; bot bubbles use the blue bot-accent palette.
 */
export const VoiceBubble = ({ message, index }: TProps) => {
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
            'inline-flex items-center gap-0.5 self-end whitespace-nowrap text-mini leading-none',
            isMe ? 'text-tg-bubble-me-accent' : 'text-tg-timestamp-muted',
          )}
        >
          {BUBBLE_TIMESTAMP}
          <DoubleCheckIcon size={14} className="text-tg-bubble-me-accent" />
        </span>
      </div>
    </div>
  );
};
