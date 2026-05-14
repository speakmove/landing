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
    <fieldset className="m-0 p-0">
      <legend className="block text-[13.5px] font-semibold text-ink">
        {label}
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      </legend>
      <div
        aria-describedby={invalid && errorId ? errorId : undefined}
        className="mt-2 flex flex-col gap-3"
      >
        {options.map((opt) => {
          const isDefault = !prevValue && opt.value === 'plus';
          const isSelected = prevValue === opt.value || isDefault;
          return (
            <label
              key={opt.value}
              className="m-0 flex cursor-pointer items-center gap-4"
            >
              <input
                type="radio"
                name="plan"
                value={opt.value}
                required
                defaultChecked={isSelected}
                disabled={disabled}
                aria-label={`${opt.title} — ${opt.subtitle}`}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'relative h-7 w-7 shrink-0 rounded-full border-[1.5px] transition',
                  'peer-checked:border-primary',
                  invalid ? 'border-red-500' : 'border-line-strong',
                  "after:absolute after:inset-[6px] after:rounded-full after:bg-primary after:opacity-0 after:transition after:content-['']",
                  'peer-checked:after:opacity-100',
                )}
              />
              <span className="leading-tight">
                <span className="block text-[15px] font-semibold text-ink">{opt.title}</span>
                <span className="block text-[13px] leading-snug text-muted">
                  {opt.subtitle}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} errors={errors} />
    </fieldset>
  );
};
