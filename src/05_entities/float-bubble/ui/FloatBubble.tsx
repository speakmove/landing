import type { TFloatBubble } from '../model/types';

type TProps = {
  bubble: TFloatBubble;
  className?: string;
};

export function FloatBubble({ bubble, className = '' }: TProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 shadow-[var(--shadow-mid)] text-left',
        className,
      ].join(' ')}
    >
      <p className="text-[13px] font-bold text-[color:var(--color-ink)] leading-tight">
        {bubble.title}
      </p>
      <p className="text-[11px] text-[color:var(--color-muted)] leading-tight mt-0.5">
        {bubble.subtitle}
      </p>
    </div>
  );
}
