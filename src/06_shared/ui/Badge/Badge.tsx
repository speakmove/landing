import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TTone = 'neutral' | 'primary' | 'gold';

type TProps = PropsWithChildren<{
  className?: string;
  tone?: TTone;
}>;

const toneClass: Record<TTone, string> = {
  neutral: 'bg-white/85 border-[color:var(--color-line)] text-[color:var(--color-muted)]',
  primary: 'bg-[color:var(--color-primary-pale)] border-[color:var(--color-primary)] text-[color:var(--color-primary-ink)]',
  gold: 'bg-[color:var(--color-gold-pale)] border-[color:var(--color-gold)] text-[color:var(--color-ink)]',
};

export function Badge({ tone = 'neutral', className, children }: TProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold md:text-[13px]',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
