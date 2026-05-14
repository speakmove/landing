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
        'block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors',
        'min-h-11 placeholder:text-faint',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-pale',
        'disabled:cursor-not-allowed disabled:bg-surface',
        invalid
          ? 'border-red-500 focus-visible:ring-red-100'
          : 'border-line-strong',
        className,
      )}
      {...rest}
    />
  );
};
