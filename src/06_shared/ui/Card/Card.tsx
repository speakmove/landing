import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TAs = 'div' | 'article' | 'li';

type TProps = PropsWithChildren<{
  className?: string;
  as?: TAs;
}>;

export function Card({ as = 'div', className, children }: TProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-[color:var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)] transition-shadow',
        'hover:shadow-[var(--shadow-mid)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
