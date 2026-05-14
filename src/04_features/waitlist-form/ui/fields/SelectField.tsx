import { Select, Label, FieldError } from '@/shared/ui';

type TOption = { value: string; label: string };

type TProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  errors?: string[];
  errorId?: string;
  options: TOption[];
  defaultValue?: string;
  hint?: string;
  hintId?: string;
  disabled?: boolean;
};

export const SelectField = ({
  id,
  name,
  label,
  placeholder,
  required,
  invalid,
  errors,
  errorId,
  options,
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
        <Select
          id={id}
          name={name}
          required={required}
          aria-required={required ? 'true' : undefined}
          invalid={invalid}
          aria-describedby={ariaDescribedBy}
          options={options}
          placeholder={placeholder}
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
