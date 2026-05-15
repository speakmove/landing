import Link from 'next/link';
import { FieldError } from '@/shared/ui';

type TConsentSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; text: string; href: string };

type TProps = {
  segments: TConsentSegment[];
  invalid?: boolean;
  errors?: string[];
  errorId?: string;
  disabled?: boolean;
};

export const ConsentField = ({
  segments,
  invalid,
  errors,
  errorId,
  disabled,
}: TProps) => {
  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          value="on"
          required
          aria-required="true"
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid && errorId ? errorId : undefined}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line-strong accent-primary"
        />
        <label
          htmlFor="consent"
          className="text-sm leading-snug text-muted"
        >
          {segments.map((seg, i) => {
            if (seg.type === 'link') {
              return (
                <Link
                  key={i}
                  href={seg.href}
                  className="underline hover:text-ink"
                  onClick={(e) => e.stopPropagation()}
                >
                  {seg.text}
                </Link>
              );
            }
            return <span key={i}>{seg.value}</span>;
          })}
        </label>
      </div>
      <FieldError id={errorId} errors={errors} />
    </div>
  );
};
