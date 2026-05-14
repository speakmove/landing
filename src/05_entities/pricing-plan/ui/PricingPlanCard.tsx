import { Badge, CheckIcon, VisuallyHidden } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import type { TPricingPlan } from '../model/types';

type TBilling = 'monthly' | 'yearly';

type TProps = {
  plan: TPricingPlan;
  billing: TBilling;
  className?: string;
};

function resolvePrice(
  raw: { amount: string; period: string } | string | undefined,
): { amount: string; period: string } | null {
  if (!raw) return null;
  if (typeof raw === 'string') return { amount: raw, period: '' };
  return raw;
}

export function PricingPlanCard({ plan, billing, className }: TProps) {
  const priceRaw = plan.price[billing];
  const resolved = resolvePrice(priceRaw);
  const wasPrice = plan.wasPrice?.[billing];

  const isPlus = plan.id === 'plus';
  const isPremium = plan.id === 'premium';

  const ctaVariant = plan.ctaStyle ?? 'primary';

  return (
    <article
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl border p-6',
        isPlus
          ? 'border-[color:var(--color-primary)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_15%,transparent)] bg-white'
          : 'border-[color:var(--color-line)] bg-white shadow-[var(--shadow-soft)]',
        className,
      )}
    >
      {plan.badge && (
        <Badge tone="primary" className="self-start">
          {plan.badge}
        </Badge>
      )}

      <div>
        <h3 className="text-[18px] font-bold text-[color:var(--color-ink)] mb-1">{plan.name}</h3>

        {wasPrice && (
          <p className="text-[13px] text-[color:var(--color-muted)] line-through mb-0.5">
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
                  ? 'text-[color:var(--color-gold)]'
                  : 'text-[color:var(--color-ink)]',
              )}
            >
              {resolved.amount.startsWith('$') ? resolved.amount : `$${resolved.amount}`}
            </span>
            {resolved.period && (
              <span className="text-[14px] text-[color:var(--color-muted)]">
                {resolved.period}
              </span>
            )}
          </div>
        )}

        {plan.note && (
          <p className="mt-1.5 text-[13px] text-[color:var(--color-muted)] leading-snug">
            {plan.note}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-2" aria-label={`Включено в ${plan.name}`}>
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-[14px] text-[color:var(--color-ink)]">
            <CheckIcon size={15} className="mt-0.5 text-[color:var(--color-primary)] shrink-0" />
            {feat}
          </li>
        ))}
      </ul>

      {plan.excluded && plan.excluded.length > 0 && (
        <ul className="flex flex-col gap-1.5" aria-label={`Не включено в ${plan.name}`}>
          {plan.excluded.map((excl) => (
            <li
              key={excl}
              className="flex items-start gap-2 text-[13px] text-[color:var(--color-muted)] line-through"
            >
              <VisuallyHidden>Недоступно:</VisuallyHidden>
              {excl}
            </li>
          ))}
        </ul>
      )}

      <a
        href="https://t.me/speakmove_bot"
        rel="noopener noreferrer"
        className={cn(
          'mt-auto inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
          ctaVariant === 'primary'
            ? 'bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-[color:var(--color-primary)]'
            : 'border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)] focus-visible:outline-[color:var(--color-primary)]',
        )}
      >
        {plan.cta}
      </a>
    </article>
  );
}
