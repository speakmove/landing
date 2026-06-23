import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'svg'> & {
  size?: number;
  label?: string;
  children: ReactNode;
};

export const Icon = ({ ref, size = 16, label, className, children, ...rest }: TProps) => {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: false as const };
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block shrink-0', className)}
      {...ariaProps}
      {...rest}
    >
      {children}
    </svg>
  );
};
