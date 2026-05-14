import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/model/libs/cn';
import { Link } from '@/shared/model/libs/i18n/navigation';

type TVariant = 'primary' | 'outline' | 'ghost';
type TSize = 'sm' | 'md' | 'lg';

type TLinkProps = ComponentPropsWithoutRef<typeof Link>;

type TProps = Omit<TLinkProps, 'children'> & {
  variant?: TVariant;
  size?: TSize;
  children: ReactNode;
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

export const ButtonLink = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: TProps) => {
  return (
    <Link
      {...rest}
      className={cn('btn', variantClass[variant], sizeClass[size], className)}
    >
      {children}
    </Link>
  );
};
