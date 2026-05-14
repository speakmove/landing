import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TOption = { value: string; label: string };

type TProps = ComponentPropsWithRef<'select'> & {
  invalid?: boolean;
  options: TOption[];
  placeholder?: string;
};

export const Select = ({
  ref,
  invalid,
  options,
  placeholder,
  className,
  defaultValue,
  ...rest
}: TProps) => {
  return (
    <select
      ref={ref}
      defaultValue={defaultValue ?? ''}
      aria-invalid={invalid ? true : undefined}
      className={cn(
        'block w-full appearance-none rounded-xl border-[1.5px] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors',
        'min-h-12 cursor-pointer pr-10',
        'focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]',
        'disabled:cursor-not-allowed disabled:bg-surface',
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239ca3af%22 stroke-width=%222.5%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:0.75rem_0.75rem] bg-[position:right_0.875rem_center] bg-no-repeat",
        invalid
          ? 'border-red-500 focus:shadow-[0_0_0_3px_color-mix(in_oklab,#ef4444_12%,transparent)]'
          : 'border-line-strong',
        className,
      )}
      {...rest}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
