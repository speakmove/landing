import { CheckIcon, VisuallyHidden } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { PATHS } from '@/shared/config';
import type { TPricingPlan } from '../model/types';

type TBilling = 'monthly' | 'yearly';

export type TPricingPlanAriaLabels = {
  featuresIncludedTemplate: string;
  featuresExcludedTemplate: string;
  unavailable: string;
};

type TProps = {
  plan: TPricingPlan;
  billing: TBilling;
  className?: string;
  ariaLabels: TPricingPlanAriaLabels;
};

const resolvePrice = (
  raw: { amount: string; period: string } | string | undefined,
): { amount: string; period: string } | null => {
  if (!raw) return null;
  if (typeof raw === 'string') return { amount: raw, period: '' };
  return raw;
};

// TODO(currency): normalize price prefix per locale/region (backend signal needed).
// For now we keep $ as the default and respect non-$ amounts already coming from i18n.
const formatAmount = (raw: string): string => {
  if (!raw) return raw;
  if (raw.startsWith('$') || raw.startsWith('€') || raw.startsWith('£') || raw.startsWith('₴')) {
    return raw;
  }
  return `$${raw}`;
};

export const PricingPlanCard = ({ plan, billing, className, ariaLabels }: TProps) => {
  const priceRaw = plan.price[billing];
  const resolved = resolvePrice(priceRaw);
  const wasPrice = plan.wasPrice?.[billing];

  const isPlus = plan.id === 'plus';

  const featuresIncludedLabel = ariaLabels.featuresIncludedTemplate.replace(
    '{planName}',
    plan.name,
  );
  const featuresExcludedLabel = ariaLabels.featuresExcludedTemplate.replace(
    '{planName}',
    plan.name,
  );

  return (
    <article
      className={cn(
        'relative flex flex-col rounded-[28px] bg-white p-7 md:p-8',
        isPlus
          ? 'border border-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_12%,transparent),0_4px_10px_rgba(10,22,18,0.05),0_12px_32px_rgba(10,22,18,0.06)] lg:-translate-y-2'
          : 'border border-line',
        className,
      )}
    >
      {plan.badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.04em] text-white">
          {plan.badge}
        </span>
      ) : null}

      <div
        className={cn(
          'text-base font-bold tracking-tight',
          isPlus ? 'text-primary' : 'text-muted',
        )}
      >
        {plan.name}
      </div>

      {plan.tagline ? (
        <div className="mt-1 text-[13px] text-faint">{plan.tagline}</div>
      ) : null}

      {wasPrice ? (
        <div className="mt-4 mb-0.5 text-[13px] text-faint line-through">{wasPrice}</div>
      ) : null}

      {resolved ? (
        <div
          className={cn(
            'mb-1 flex items-baseline gap-1.5 text-[48px] font-extrabold leading-none tracking-[-0.03em] text-ink',
            !wasPrice && 'mt-4',
          )}
        >
          <span>{formatAmount(resolved.amount)}</span>
          {resolved.period ? (
            <span className="text-[15px] font-medium text-muted">{resolved.period}</span>
          ) : null}
        </div>
      ) : null}

      {plan.note ? (
        <div className="mb-5 text-[13.5px] text-muted">{plan.note}</div>
      ) : (
        <div className="mb-5" />
      )}

      <ul
        className="m-0 mb-6 flex flex-col gap-2.5 p-0 text-[14.5px] leading-snug"
        aria-label={featuresIncludedLabel}
      >
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-ink">
            <CheckIcon size={16} strokeWidth={3} className="mt-0.5 flex-none text-primary" />
            <span>{feat}</span>
          </li>
        ))}
        {plan.excluded?.map((excl) => (
          <li key={excl} className="flex items-start gap-2.5 text-faint">
            <VisuallyHidden>{ariaLabels.unavailable}</VisuallyHidden>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="mt-0.5 flex-none"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>{excl}</span>
          </li>
        ))}
      </ul>

      <Link
        href={PATHS.waitlist}
        className={cn('btn', isPlus ? 'btn-primary' : 'btn-outline', 'mt-auto')}
        aria-label={`${plan.cta} — ${plan.name}`}
      >
        {plan.cta}
      </Link>

      {ariaLabels.unavailable && plan.excluded ? null : null}
      <span hidden>{featuresExcludedLabel}</span>
    </article>
  );
};
