import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TAs = 'div' | 'article' | 'li';

type TProps = PropsWithChildren<{
  className?: string;
  as?: TAs;
}>;

export const Card = ({ as = 'div', className, children }: TProps) => {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-line bg-white p-5 shadow-(--shadow-soft) transition-shadow',
        'hover:shadow-(--shadow-mid)',
        className,
      )}
    >
      {children}
    </Tag>
  );
};
