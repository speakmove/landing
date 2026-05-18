import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = PropsWithChildren<{
  className?: string;
}>;

export const Container = ({ children, className }: TProps) => {
  return <div className={cn('mx-auto w-full max-w-300', className)}>{children}</div>;
};
