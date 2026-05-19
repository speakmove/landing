import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'input'> & {
  invalid?: boolean;
};

export const Input = ({ ref, invalid, className, ...rest }: TProps) => {
  return (
    <input
      ref={ref}
      aria-invalid={invalid ? true : undefined}
      className={cn(
        'input-base min-h-12 placeholder:text-faint',
        'disabled:cursor-not-allowed disabled:bg-surface',
        invalid && 'input-base-invalid',
        className,
      )}
      {...rest}
    />
  );
};
