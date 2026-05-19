import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';
import { ChevronDownIcon } from '../Icon';

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
    <span className={cn('relative block w-full', className)}>
      <select
        ref={ref}
        defaultValue={defaultValue ?? ''}
        aria-invalid={invalid ? true : undefined}
        className={cn(
          'select-base pr-10',
          invalid ? 'select-base-invalid' : 'border-line-strong',
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
      <ChevronDownIcon
        size={12}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-faint"
      />
    </span>
  );
};
