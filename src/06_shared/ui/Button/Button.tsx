import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TVariant = 'primary' | 'outline' | 'ghost';
type TSize = 'sm' | 'md' | 'lg';

type TProps = ComponentPropsWithRef<'button'> & {
  variant?: TVariant;
  size?: TSize;
};

const variantClass: Record<TVariant, string> = {
  primary:
    'bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-[color:var(--color-primary-ink)]',
  outline:
    'border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)] focus-visible:outline-[color:var(--color-primary)]',
  ghost: 'bg-transparent text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)]',
};

const sizeClass: Record<TSize, string> = {
  sm: 'min-h-[36px] px-3 text-sm',
  md: 'min-h-[44px] px-5 text-[15px]',
  lg: 'min-h-[52px] px-6 text-base',
};

export function Button({
  ref,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: TProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
