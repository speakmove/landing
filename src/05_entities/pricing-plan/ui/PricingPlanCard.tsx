import { Badge, CheckIcon, VisuallyHidden } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import { URLS } from '@/shared/config';
import type { TPricingPlan } from '../model/types';

type TBilling = 'monthly' | 'yearly';

/**
 * Serializable aria-label templates.
 * Use {planName} as placeholder; the component replaces it with the actual plan name.
 */
export type TPricingPlanAriaLabels = {
  featuresIncludedTemplate: string; // e.g. "Included in {planName}"
  featuresExcludedTemplate: string; // e.g. "Not included in {planName}"
  unavailable: string;              // e.g. "Not available:"
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

export const PricingPlanCard = ({ plan, billing, className, ariaLabels }: TProps) => {
  const priceRaw = plan.price[billing];
  const resolved = resolvePrice(priceRaw);
  const wasPrice = plan.wasPrice?.[billing];

  const isPlus = plan.id === 'plus';
  const isPremium = plan.id === 'premium';

  const ctaVariant = plan.ctaStyle ?? 'primary';

  const featuresIncludedLabel = ariaLabels.featuresIncludedTemplate.replace('{planName}', plan.name);
  const featuresExcludedLabel = ariaLabels.featuresExcludedTemplate.replace('{planName}', plan.name);

  return (
    <article
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl border p-6',
        isPlus
          ? 'border-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_15%,transparent)] bg-white'
          : 'border-line bg-white shadow-(--shadow-soft)',
        className,
      )}
    >
      {plan.badge && (
        <Badge tone="primary" className="self-start">
          {plan.badge}
        </Badge>
      )}

      <div>
        <h3 className="text-lg font-bold text-ink mb-1">{plan.name}</h3>

        {wasPrice && (
          <p className="text-xs text-muted line-through mb-0.5">
            {wasPrice}
          </p>
        )}

        {resolved && (
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'font-extrabold tracking-tight',
                plan.id === 'free' ? 'text-[2rem]' : 'text-[2.2rem]',
                isPremium
                  ? 'text-gold'
                  : 'text-ink',
              )}
            >
              {resolved.amount.startsWith('$') ? resolved.amount : `$${resolved.amount}`}
            </span>
            {resolved.period && (
              <span className="text-sm text-muted">
                {resolved.period}
              </span>
            )}
          </div>
        )}

        {plan.note && (
          <p className="mt-1.5 text-xs text-muted leading-snug">
            {plan.note}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-2" aria-label={featuresIncludedLabel}>
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-sm text-ink">
            <CheckIcon size={15} className="mt-0.5 text-primary shrink-0" />
            {feat}
          </li>
        ))}
      </ul>

      {plan.excluded && plan.excluded.length > 0 && (
        <ul className="flex flex-col gap-1.5" aria-label={featuresExcludedLabel}>
          {plan.excluded.map((excl) => (
            <li
              key={excl}
              className="flex items-start gap-2 text-xs text-muted line-through"
            >
              <VisuallyHidden>{ariaLabels.unavailable}</VisuallyHidden>
              {excl}
            </li>
          ))}
        </ul>
      )}

      <a
        href={URLS.telegramBot}
        rel="noopener noreferrer"
        className={cn(
          'mt-auto inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
          ctaVariant === 'primary'
            ? 'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary'
            : 'border border-line-strong bg-white text-ink hover:bg-surface focus-visible:outline-primary',
        )}
      >
        {plan.cta}
      </a>
    </article>
  );
}
