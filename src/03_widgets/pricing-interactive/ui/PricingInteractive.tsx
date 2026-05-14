'use client';

import { useState } from 'react';
import { Container } from '@/shared/ui';
import { BillingToggle, type TBillingValue } from '@/features/billing-toggle';
import { PricingPlanCard, type TPricingPlanAriaLabels } from '@/entities/pricing-plan';
import type { TPricingPlan } from '@/entities/pricing-plan';

type TFomoData = {
  title: string;
  plansLine: string;
  countLabel: string;
  current: number;
  total: number;
};

type TBillingLabels = {
  monthly: string;
  yearly: string;
  yearlySaveLabel: string;
};

type THeroData = {
  crumb: string;
  title: string;
  description: string;
};

type TProps = {
  hero: THeroData;
  plans: TPricingPlan[];
  billingLabels: TBillingLabels;
  fomo: TFomoData;
  disclaimer: string;
  planAriaLabels: TPricingPlanAriaLabels;
};

export const PricingInteractive = ({
  hero,
  plans,
  billingLabels,
  fomo,
  disclaimer,
  planAriaLabels,
}: TProps) => {
  const [billing, setBilling] = useState<TBillingValue>('monthly');

  const countLabel = fomo.countLabel
    .replace('{current}', String(fomo.current))
    .replace('{total}', String(fomo.total));

  const pct = Math.min(100, Math.round((fomo.current / fomo.total) * 1000) / 10);

  return (
    <>
      <header className="relative overflow-hidden px-5 pt-16 pb-10 text-center md:pt-20">
        <div aria-hidden="true" className="page-hero-bg" />
        <Container className="px-0">
          <div className="mx-auto max-w-[760px]">
            <div className="section-eyebrow !mb-0">{hero.crumb}</div>

            <h1
              id="pricing-hero-heading"
              className="my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)' }}
            >
              {hero.title}
            </h1>

            <p className="mx-auto max-w-[620px] text-pretty text-[18px] text-muted">
              {hero.description}
            </p>

            <div
              className="mx-auto mt-6 max-w-[720px] rounded-[18px] bg-white px-5 py-4 text-left shadow-(--shadow-soft)"
              style={{
                border:
                  '1px solid color-mix(in oklab, var(--color-primary) 35%, var(--color-line))',
              }}
            >
              <div className="mb-2.5 flex items-center gap-2.5 text-[14.5px] font-bold text-ink">
                <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-primary" />
                {fomo.title}
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={fomo.total}
                aria-valuenow={fomo.current}
                aria-label={fomo.title}
                className="mb-2 h-2 overflow-hidden rounded-full bg-[#eceee8]"
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-primary to-primary-hover"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[12.5px] font-semibold text-muted">
                <span>{fomo.plansLine}</span>
                <span className="tabular-nums">
                  <span className="text-ink">{fomo.current}</span> / {fomo.total} —{' '}
                  {countLabel.replace(`${fomo.current} / ${fomo.total}`, '').trim() ||
                    fomo.countLabel.replace('{current}', '').replace('{total}', '').trim()}
                </span>
              </div>
            </div>

            <div className="mt-9 inline-flex">
              <BillingToggle
                value={billing}
                onChange={setBilling}
                monthlyLabel={billingLabels.monthly}
                yearlyLabel={billingLabels.yearly}
                yearlySaveLabel={billingLabels.yearlySaveLabel}
              />
            </div>
          </div>
        </Container>
      </header>

      <section id="plans" className="px-5 pb-20">
        <Container>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingPlanCard
                key={plan.id}
                plan={plan}
                billing={billing}
                ariaLabels={planAriaLabels}
              />
            ))}
          </div>
          <p className="mt-6 text-center text-[13.5px] text-muted">{disclaimer}</p>
        </Container>
      </section>
    </>
  );
};
