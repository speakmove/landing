import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TOption = { value: string; label: string };

type TProps = ComponentPropsWithRef<'select'> & {
  invalid?: boolean;
  options: TOption[];
  placeholder?: string;
};

export const Select = ({ ref, invalid, options, placeholder, className, defaultValue, ...rest }: TProps) => {
  return (
    <select
      ref={ref}
      defaultValue={defaultValue ?? ''}
      aria-invalid={invalid ? true : undefined}
      className={cn(
        'block w-full appearance-none rounded-xl border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors',
        'min-h-11 cursor-pointer pr-10',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-pale',
        'disabled:cursor-not-allowed disabled:bg-surface',
        // custom chevron via background-image
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat",
        invalid ? 'border-red-500 focus-visible:ring-red-100' : 'border-line-strong',
        className,
      )}
      {...rest}
    >
      {placeholder ? <option value="" disabled>{placeholder}</option> : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
