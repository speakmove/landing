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
    'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary-ink',
  outline:
    'border border-line-strong bg-white text-ink hover:bg-surface focus-visible:outline-primary',
  ghost: 'bg-transparent text-ink hover:bg-surface',
};

const sizeClass: Record<TSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-6 text-base',
};

export const Button = ({
  ref,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: TProps) => {
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
};
