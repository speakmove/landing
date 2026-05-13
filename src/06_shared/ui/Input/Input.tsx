import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'input'> & {
  invalid?: boolean;
};

export function Input({ ref, invalid, className, ...rest }: TProps) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid ? true : undefined}
      className={cn(
        'block w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors',
        'min-h-[44px] placeholder:text-[color:var(--color-faint)]',
        'focus-visible:border-[color:var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-pale)]',
        'disabled:cursor-not-allowed disabled:bg-[color:var(--color-surface)]',
        invalid
          ? 'border-red-500 focus-visible:ring-red-100'
          : 'border-[color:var(--color-line-strong)]',
        className,
      )}
      {...rest}
    />
  );
}
