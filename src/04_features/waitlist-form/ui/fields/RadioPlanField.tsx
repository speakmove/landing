import { cn } from '@/shared/model/libs/cn';
import { FieldError } from '@/shared/ui';

type TPlanOption = {
  value: string;
  title: string;
  subtitle: string;
};

type TProps = {
  label: string;
  options: TPlanOption[];
  prevValue?: string;
  invalid?: boolean;
  errors?: string[];
  errorId?: string;
  disabled?: boolean;
};

export const RadioPlanField = ({
  label,
  options,
  prevValue,
  invalid,
  errors,
  errorId,
  disabled,
}: TProps) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-ink">
        {label}
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      </legend>
      <div
        aria-describedby={invalid && errorId ? errorId : undefined}
        className="mt-2 grid gap-3 sm:grid-cols-2"
      >
        {options.map((opt) => {
          const isDefault = !prevValue && opt.value === 'plus';
          const isSelected = prevValue === opt.value || isDefault;
          return (
            <label
              key={opt.value}
              className={cn(
                'relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors',
                'has-[:checked]:border-primary has-[:checked]:bg-primary-pale',
                invalid
                  ? 'border-red-500'
                  : 'border-line-strong hover:border-primary',
              )}
            >
              <input
                type="radio"
                name="plan"
                value={opt.value}
                required
                defaultChecked={isSelected}
                disabled={disabled}
                className="sr-only"
              />
              <span className="font-semibold text-ink">{opt.title}</span>
              <span className="text-sm text-muted">{opt.subtitle}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} errors={errors} />
    </fieldset>
  );
};
