import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ANCHORS } from '@/shared/config';
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
    <Section id={ANCHORS.flow} ariaLabelledBy="flow-heading" className="py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="flow-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <ol
            className="relative m-0 list-none p-0 pl-11"
            aria-label={tCommon('aria.flowSteps')}
          >
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <li
                  key={step.num}
                  className={cn('relative pt-1', isLast ? '' : 'pb-7')}
                >
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="flow-step-line absolute left-[17px] top-11 bottom-0 w-0.5"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="absolute -left-11 top-0 grid h-9 w-9 place-items-center rounded-full border-2 border-primary bg-white font-mono text-sm font-bold text-primary shadow-[0_0_0_4px_var(--color-primary-pale)]"
                  >
                    {idx + 1}
                  </span>
                  <h3 className="m-0 mb-1.5 text-lg font-bold tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="m-0 text-14-5 leading-[1.55] text-muted">
                    {step.description}
                  </p>
                  {step.tag ? (
                    <span
                      className={cn(
                        'mt-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold',
                        step.tagStyle === 'gold'
                          ? 'bg-gold-pale text-[#7a5508]'
                          : 'bg-primary-pale text-primary-ink',
                      )}
                    >
                      {step.tag}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-[88px]">
            <HowItWorksPhonePreview preview={phonePreview} />
          </div>
        </div>
      </Container>
    </Section>
  );
};
