import { getTranslations } from 'next-intl/server';
import {
  ButtonLink,
  CheckIcon,
  Container,
  Section,
  SectionHead,
  VisuallyHidden,
} from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import { ANCHORS, PATHS } from '@/shared/config';

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

export const HomePricingTeaser = async () => {
  const t = await getTranslations('HomePage.pricing');
  const tCommon = await getTranslations('Common');

  const plans = t.raw('plans') as unknown as TPlan[];

  return (
    <Section
      id={ANCHORS.pricing}
      ariaLabelledBy="pricing-heading"
      className="bg-surface px-5 py-16 md:py-22"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="pricing-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const monthlyPrice = plan.price.monthly;
            const isFreePlan = plan.id === 'free';
            const isPlus = plan.id === 'plus';

            let displayAmount: string;
            let displayPeriod: string;

            if (typeof monthlyPrice === 'string') {
              displayAmount = monthlyPrice;
              displayPeriod = '';
            } else {
              const a = monthlyPrice.amount;
              displayAmount = a.startsWith('$') || a.startsWith('€') ? a : `$${a}`;
              displayPeriod = monthlyPrice.period;
            }

            return (
              <article
                key={plan.id}
                className={cn(
                  'relative flex flex-col rounded-[28px] bg-white p-7',
                  isPlus
                    ? 'border border-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_12%,transparent),0_4px_10px_rgba(10,22,18,0.05),0_12px_32px_rgba(10,22,18,0.06)] lg:-translate-y-1.5'
                    : 'border border-line',
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

                {plan.wasPrice ? (
                  <div className="mt-4 mb-0.5 text-[13px] text-faint line-through">
                    {plan.wasPrice.monthly}
                  </div>
                ) : null}

                <div
                  className={cn(
                    'mb-1 flex items-baseline gap-1.5 text-[44px] font-extrabold leading-none tracking-[-0.03em] text-ink',
                    !plan.wasPrice && 'mt-4',
                  )}
                >
                  <span>{displayAmount}</span>
                  {displayPeriod ? (
                    <span className="text-[15px] font-medium text-muted">{displayPeriod}</span>
                  ) : null}
                </div>

                {plan.note ? (
                  <div className="mb-5 text-[13.5px] text-muted">{plan.note}</div>
                ) : (
                  <div className="mb-5" />
                )}

                <ul
                  className="m-0 mb-6 flex flex-col gap-2.5 p-0 text-[14.5px] leading-snug"
                  aria-label={tCommon('aria.featuresIncluded', { planName: plan.name })}
                >
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-ink">
                      <CheckIcon
                        size={16}
                        className="mt-0.5 flex-none text-primary"
                        strokeWidth={3}
                      />
                      {feat}
                    </li>
                  ))}
                  {plan.excluded?.map((excl) => (
                    <li key={excl} className="flex items-start gap-2.5 text-faint">
                      <VisuallyHidden>{tCommon('unavailable')}</VisuallyHidden>
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
                      {excl}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={PATHS.waitlist}
                  variant={isPlus ? 'primary' : 'outline'}
                  className="mt-auto w-full"
                >
                  {plan.cta}
                </ButtonLink>

                {isFreePlan ? null : null}
              </article>
            );
          })}
        </div>

        <p className="mt-7 text-center text-[13.5px] text-muted">{t('footer')}</p>
      </Container>
    </Section>
  );
};
