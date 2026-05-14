import { getTranslations } from 'next-intl/server';
import { Badge, CheckIcon, Container, Section, VisuallyHidden } from '@/shared/ui';

type TPlanPrice = string | { amount: string; period: string };

type TPlan = {
  id: string;
  name: string;
  badge?: string;
  wasPrice?: { monthly: string; yearly: string };
  price: {
    monthly: TPlanPrice;
    yearly: TPlanPrice;
  };
  note?: string;
  features: string[];
  excluded?: string[];
  cta: string;
};

export async function HomePricingTeaser() {
  const t = await getTranslations('HomePage.pricing');

  const plans = t.raw('plans') as unknown as TPlan[];

  return (
    <Section id="pricing" ariaLabelledBy="pricing-heading">
      <Container>
        <div className="mb-10 text-center max-w-150 mx-auto">
          <span className="inline-block mb-3 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('kicker')}
          </span>
          <h2
            id="pricing-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 3-plan grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const monthlyPrice = plan.price.monthly;
            const isFreePlan = plan.id === 'free';
            const isPremium = plan.id === 'premium';
            const isPlus = plan.id === 'plus';

            // Resolve display price
            let displayAmount: string;
            let displayPeriod: string;

            if (typeof monthlyPrice === 'string') {
              displayAmount = monthlyPrice;
              displayPeriod = '';
            } else {
              displayAmount = `$${monthlyPrice.amount}`;
              displayPeriod = monthlyPrice.period;
            }

            return (
              <article
                key={plan.id}
                className={[
                  'relative rounded-2xl border p-6 flex flex-col gap-4',
                  isPlus
                    ? 'border-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_15%,transparent)] bg-white'
                    : 'border-line bg-white shadow-(--shadow-soft)',
                ].join(' ')}
              >
                {plan.badge && (
                  <Badge tone="primary" className="self-start">
                    {plan.badge}
                  </Badge>
                )}

                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">
                    {plan.name}
                  </h3>

                  {plan.wasPrice && (
                    <p className="text-xs text-muted line-through mb-0.5">
                      {plan.wasPrice.monthly}
                    </p>
                  )}

                  <div className="flex items-baseline gap-1">
                    <span
                      className={[
                        'font-extrabold tracking-tight',
                        isFreePlan ? 'text-[2rem]' : 'text-[2.2rem]',
                        isPremium
                          ? 'text-gold'
                          : 'text-ink',
                      ].join(' ')}
                    >
                      {displayAmount}
                    </span>
                    {displayPeriod && (
                      <span className="text-sm text-muted">
                        {displayPeriod}
                      </span>
                    )}
                  </div>

                  {plan.note && (
                    <p className="mt-1.5 text-xs text-muted leading-snug">
                      {plan.note}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2" aria-label={`Включено в ${plan.name}`}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-ink">
                      <CheckIcon
                        size={15}
                        className="mt-0.5 text-primary shrink-0"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Excluded */}
                {plan.excluded && plan.excluded.length > 0 && (
                  <ul className="flex flex-col gap-1.5" aria-label={`Не включено в ${plan.name}`}>
                    {plan.excluded.map((excl) => (
                      <li
                        key={excl}
                        className="flex items-start gap-2 text-xs text-muted line-through"
                      >
                        <VisuallyHidden>Недоступно:</VisuallyHidden>
                        {excl}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA */}
                <a
                  href="#cta"
                  className={[
                    'mt-auto inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                    isPlus || isPremium
                      ? 'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary'
                      : 'border border-line-strong bg-white text-ink hover:bg-surface focus-visible:outline-primary',
                  ].join(' ')}
                >
                  {plan.cta}
                </a>
              </article>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted">
          {t('footer')}
        </p>
      </Container>
    </Section>
  );
}
