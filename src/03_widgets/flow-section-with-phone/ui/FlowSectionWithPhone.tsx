import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { StepCard } from '@/entities/step-card';
import type { TStep } from '@/entities/step-card';
import type { TChatMessage } from '@/entities/chat-message';
import { HowItWorksPhonePreview } from './HowItWorksPhonePreview';

type TPhonePreview = {
  botName: string;
  botStatus: string;
  messages: TChatMessage[];
};

export const FlowSectionWithPhone = async () => {
  const t = await getTranslations('HowItWorksPage.flow');
  const tCommon = await getTranslations('Common');

  const steps = t.raw('steps') as unknown as TStep[];
  const phonePreview = t.raw('phonePreview') as unknown as TPhonePreview;

  return (
    <Section id="flow" ariaLabelledBy="flow-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-[700px] mx-auto mb-12 text-center">
          <span className="inline-block font-mono text-xs font-semibold text-primary tracking-[0.08em] uppercase mb-3">
            {t('kicker')}
          </span>
          <h2
            id="flow-heading"
            className="font-extrabold tracking-[-0.022em] mb-3 leading-[1.1] text-balance text-ink"
            style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.5rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-base text-muted text-pretty">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column: steps + phone */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Ordered list of steps */}
          <ol className="flex flex-col gap-3" aria-label={tCommon('aria.flowSteps')}>
            {steps.map((step) => (
              <StepCard key={step.num} step={step} />
            ))}
          </ol>

          {/* Phone preview */}
          <HowItWorksPhonePreview preview={phonePreview} />
        </div>
      </Container>
    </Section>
  );
};
