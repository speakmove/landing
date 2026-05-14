import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TTone = 'neutral' | 'primary' | 'gold';

type TProps = PropsWithChildren<{
  className?: string;
  tone?: TTone;
}>;

const toneClass: Record<TTone, string> = {
  neutral: 'bg-white/85 border-line text-muted',
  primary: 'bg-primary-pale border-primary text-primary-ink',
  gold: 'bg-gold-pale border-gold text-ink',
};

export const Badge = ({ tone = 'neutral', className, children }: TProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold md:text-xs',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};
