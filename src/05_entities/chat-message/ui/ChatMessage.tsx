import { cn } from '@/shared/model/libs/cn';
import { Badge } from '@/shared/ui';
import type { TChatMessage } from '../model/types';

type TProps = {
  message: TChatMessage;
};

/** Waveform bars — purely decorative */
const WaveformBars = ({ variant }: { variant: 'bot' | 'me' }) => {
  const heights = [6, 14, 9, 18, 11, 16, 7, 13, 10, 15, 6];
  const colorClass =
    variant === 'me' ? 'bg-white/60' : 'bg-muted/50';

  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`block w-0.5 rounded-[1px] ${colorClass}`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export const ChatMessage = ({ message }: TProps) => {
  const isMe = message.from === 'me';

  if (message.type === 'voice') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div
          className={cn(
            'inline-flex items-center gap-2.5 rounded-[18px] px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,.06)] text-xs',
            isMe
              ? 'rounded-br-[3px] bg-primary text-white'
              : 'rounded-bl-[3px] bg-white text-ink',
          )}
          aria-label={`Голосовое сообщение${message.duration ? `, ${message.duration}` : ''}`}
        >
          <div
            className={cn(
              'w-6 h-6 rounded-full grid place-items-center text-[10px] flex-none',
              isMe ? 'bg-white/20 text-white' : 'bg-primary-pale text-primary',
            )}
            aria-hidden="true"
          >
            ▶
          </div>
          <WaveformBars variant={isMe ? 'me' : 'bot'} />
          {message.duration && (
            <span
              className={`font-mono text-[11.5px] ${isMe ? 'text-white/75' : 'text-muted'}`}
            >
              {message.duration}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (message.type === 'homework') {
    return (
      <div className="flex justify-start">
        <div className="relative inline-flex max-w-[85%] flex-col gap-0.5 rounded-[18px] rounded-bl-[3px] px-3 pb-1.5 pt-2.5 bg-surface shadow-[0_1px_2px_rgba(0,0,0,.06)] text-xs text-muted">
          {message.text && (
            <span className="font-medium leading-snug">{message.text}</span>
          )}
          {message.translation && (
            <span className="text-[11px] text-muted leading-snug border-t border-line pt-1 mt-0.5">
              {message.translation}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          'relative inline-flex max-w-[85%] flex-col gap-0.5 rounded-[18px] px-3 pb-1.5 pt-2.5 shadow-[0_1px_2px_rgba(0,0,0,.06)] text-xs',
          isMe
            ? 'rounded-br-[3px] bg-[#dbf3c9] text-[#1a3a0e]'
            : 'rounded-bl-[3px] bg-white text-ink',
        )}
      >
        {message.text && (
          <span className="font-medium leading-snug">{message.text}</span>
        )}

        {message.meta && (
          <span className="text-[11px] text-muted leading-none">
            {message.meta}
          </span>
        )}

        {message.translation && (
          <span className="text-[11px] text-muted leading-snug border-t border-line pt-1 mt-0.5">
            {message.translation}
          </span>
        )}

        {message.reward && (
          <Badge tone="primary" className="mt-1 self-start text-[10px]">
            {message.reward}
          </Badge>
        )}

        {message.highlight && (
          <Badge tone="gold" className="mt-1 self-start text-[10px]">
            {message.highlight}
          </Badge>
        )}
      </div>
    </div>
  );
}
