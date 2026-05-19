import { cn } from '@/shared/model/libs/cn';
import type { TFloatBubble } from '../model/types';

type TProps = {
  bubble: TFloatBubble;
  className?: string;
};

export const FloatBubble = ({ bubble, className = '' }: TProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-xl border border-line bg-white px-3 py-2 shadow-(--shadow-mid) text-left',
        className,
      )}
    >
      <p className="text-xs font-bold text-ink leading-tight">
        {bubble.title}
      </p>
      <p className="text-mini text-muted leading-tight mt-0.5">
        {bubble.subtitle}
      </p>
    </div>
  );
};
