import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { StepCard } from '@/entities/step-card';
import type { TStep } from '@/entities/step-card';

export const HomeHowItWorks = async () => {
  const t = await getTranslations('HomePage.howItWorks');

  const steps = t.raw('steps') as unknown as TStep[];

  return (
    <Section id="how-it-works" ariaLabelledBy="how-it-works-heading" className="bg-surface">
      <Container>
        <div className="mb-10 max-w-160">
          <span className="inline-block mb-3 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('kicker')}
          </span>
          <h2
            id="how-it-works-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 4-step grid */}
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {steps.map((step) => (
            <li key={step.num}>
              <StepCard step={step} />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
