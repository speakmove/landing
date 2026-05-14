'use client';

import { useState } from 'react';
import { Container, Section } from '@/shared/ui';
import { BillingToggle, type TBillingValue } from '@/widgets/billing-toggle';
import { PricingPlanCard } from '@/entities/pricing-plan';
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
};

export const PricingInteractive = ({ hero, plans, billingLabels, fomo, disclaimer }: TProps) => {
  const [billing, setBilling] = useState<TBillingValue>('monthly');

  const countLabel = fomo.countLabel
    .replace('{current}', String(fomo.current))
    .replace('{total}', String(fomo.total));

  return (
    <Section id="pricing-hero" ariaLabelledBy="pricing-hero-heading">
      <Container>
        {/* Hero header */}
        <div className="mb-10 text-center max-w-[680px] mx-auto flex flex-col items-center gap-5">
          {/* Breadcrumb chip */}
          <span className="inline-block rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {hero.crumb}
          </span>

          <h1
            id="pricing-hero-heading"
            className="text-[clamp(1.75rem,4vw,2.8rem)] font-extrabold leading-tight tracking-[-0.025em] text-ink"
          >
            {hero.title}
          </h1>

          <p className="text-[17px] text-muted leading-relaxed max-w-[540px]">
            {hero.description}
          </p>

          {/* Billing toggle */}
          <BillingToggle
            value={billing}
            onChange={setBilling}
            monthlyLabel={billingLabels.monthly}
            yearlyLabel={billingLabels.yearly}
            yearlySaveLabel={billingLabels.yearlySaveLabel}
          />

          {/* FOMO callout */}
          <div className="w-full rounded-2xl border border-primary bg-primary-pale px-5 py-4 text-center">
            <p className="text-sm font-bold text-ink mb-1">{fomo.title}</p>
            <p className="text-xs text-muted mb-2">{fomo.plansLine}</p>
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-semibold text-ink tabular-nums">
                {countLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 3-plan grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingPlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-muted">
          {disclaimer}
        </p>
      </Container>
    </Section>
  );
}
