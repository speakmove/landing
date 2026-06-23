import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TVariant = 'primary' | 'outline' | 'ghost';
type TSize = 'sm' | 'md' | 'lg';

type TProps = ComponentPropsWithRef<'button'> & {
  variant?: TVariant;
  size?: TSize;
};

const variantClass: Record<TVariant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const sizeClass: Record<TSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
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
      className={cn('btn', variantClass[variant], sizeClass[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
};
