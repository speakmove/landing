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
        'block w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors',
        'min-h-12 placeholder:text-faint',
        'focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]',
        'disabled:cursor-not-allowed disabled:bg-surface',
        invalid
          ? 'border-red-500 focus:shadow-[0_0_0_3px_color-mix(in_oklab,#ef4444_12%,transparent)]'
          : 'border-line-strong',
        className,
      )}
      {...rest}
    />
  );
};
