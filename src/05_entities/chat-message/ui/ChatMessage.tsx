import { Badge } from '@/shared/ui';
import type { TChatMessage } from '../model/types';

type TProps = {
  message: TChatMessage;
};

export function ChatMessage({ message }: TProps) {
  const isMe = message.from === 'me';

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'relative inline-flex max-w-[85%] flex-col gap-0.5 rounded-[18px] px-3 pb-1.5 pt-2.5 shadow-[0_1px_2px_rgba(0,0,0,.06)] text-[13px]',
          isMe
            ? 'rounded-br-[3px] bg-[#dbf3c9] text-[#1a3a0e]'
            : 'rounded-bl-[3px] bg-white text-[color:var(--color-ink)]',
        ].join(' ')}
      >
        <span className="font-medium leading-snug">{message.text}</span>

        {message.meta && (
          <span className="text-[11px] text-[color:var(--color-muted)] leading-none">
            {message.meta}
          </span>
        )}

        {message.translation && (
          <span className="text-[11px] text-[color:var(--color-muted)] leading-snug border-t border-[color:var(--color-line)] pt-1 mt-0.5">
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
