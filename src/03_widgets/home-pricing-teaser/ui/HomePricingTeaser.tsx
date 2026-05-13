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
        <div className="mb-10 text-center max-w-[600px] mx-auto">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="pricing-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-[color:var(--color-muted)] leading-relaxed">
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
                    ? 'border-[color:var(--color-primary)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_15%,transparent)] bg-white'
                    : 'border-[color:var(--color-line)] bg-white shadow-[var(--shadow-soft)]',
                ].join(' ')}
              >
                {plan.badge && (
                  <Badge tone="primary" className="self-start">
                    {plan.badge}
                  </Badge>
                )}

                <div>
                  <h3 className="text-[18px] font-bold text-[color:var(--color-ink)] mb-1">
                    {plan.name}
                  </h3>

                  {plan.wasPrice && (
                    <p className="text-[13px] text-[color:var(--color-muted)] line-through mb-0.5">
                      {plan.wasPrice.monthly}
                    </p>
                  )}

                  <div className="flex items-baseline gap-1">
                    <span
                      className={[
                        'font-extrabold tracking-tight',
                        isFreePlan ? 'text-[2rem]' : 'text-[2.2rem]',
                        isPremium
                          ? 'text-[color:var(--color-gold)]'
                          : 'text-[color:var(--color-ink)]',
                      ].join(' ')}
                    >
                      {displayAmount}
                    </span>
                    {displayPeriod && (
                      <span className="text-[14px] text-[color:var(--color-muted)]">
                        {displayPeriod}
                      </span>
                    )}
                  </div>

                  {plan.note && (
                    <p className="mt-1.5 text-[13px] text-[color:var(--color-muted)] leading-snug">
                      {plan.note}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2" aria-label={`Включено в ${plan.name}`}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[14px] text-[color:var(--color-ink)]">
                      <CheckIcon
                        size={15}
                        className="mt-0.5 text-[color:var(--color-primary)] shrink-0"
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
                        className="flex items-start gap-2 text-[13px] text-[color:var(--color-muted)] line-through"
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
                    'mt-auto inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                    isPlus || isPremium
                      ? 'bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-[color:var(--color-primary)]'
                      : 'border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)] focus-visible:outline-[color:var(--color-primary)]',
                  ].join(' ')}
                >
                  {plan.cta}
                </a>
              </article>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-[12px] text-[color:var(--color-muted)]">
          {t('footer')}
        </p>
      </Container>
    </Section>
  );
}
