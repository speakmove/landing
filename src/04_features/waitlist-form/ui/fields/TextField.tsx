import type { HTMLInputTypeAttribute } from 'react';
import { Input, Label, FieldError } from '@/shared/ui';

type TProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search' | 'none';
  type?: HTMLInputTypeAttribute;
  invalid?: boolean;
  errors?: string[];
  errorId?: string;
  defaultValue?: string;
  hint?: string;
  hintId?: string;
  disabled?: boolean;
};

export const TextField = ({
  id,
  name,
  label,
  placeholder,
  required,
  autoComplete,
  inputMode,
  type = 'text',
  invalid,
  errors,
  errorId,
  defaultValue,
  hint,
  hintId,
  disabled,
}: TProps) => {
  const ariaDescribedBy = [
    invalid && errorId ? errorId : undefined,
    hintId,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      <div className="mt-1.5">
        <Input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-required={required ? 'true' : undefined}
          invalid={invalid}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={ariaDescribedBy}
          defaultValue={defaultValue ?? ''}
          disabled={disabled}
        />
      </div>
      <FieldError id={errorId} errors={errors} />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
