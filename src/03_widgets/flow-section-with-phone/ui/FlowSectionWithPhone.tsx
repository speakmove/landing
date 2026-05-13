import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { StepCard } from '@/entities/step-card';
import { ChatMessage } from '@/entities/chat-message';
import type { TStep } from '@/entities/step-card';
import type { TChatMessage } from '@/entities/chat-message';

type TPhonePreview = {
  botName: string;
  botStatus: string;
  messages: TChatMessage[];
};

/** Minimal phone shell for HowItWorks page — no floatBubbles needed */
function HowItWorksPhonePreview({ preview }: { preview: TPhonePreview }) {
  return (
    <div aria-hidden="true" className="lg:sticky lg:top-[88px]">
      <div
        className="w-full max-w-[360px] mx-auto rounded-[36px] p-2.5 shadow-[0_40px_80px_rgba(10,22,18,.18),0_20px_40px_rgba(10,22,18,.14)]"
        style={{ background: '#0b1220' }}
      >
        <div
          className="rounded-[28px] px-2.5 py-3 overflow-hidden flex flex-col gap-2"
          style={{ background: '#eef2f0', minHeight: '520px' }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-2.5 px-2 pb-2.5 border-b border-[#dfe4e0] -mx-1">
            <div
              className="w-[34px] h-[34px] rounded-full grid place-items-center font-black text-[11.5px] text-white flex-none"
              style={{ background: 'linear-gradient(135deg,#4CAF50 0%,#2E7D32 100%)' }}
            >
              SM
            </div>
            <div>
              <div className="font-bold text-sm text-[color:var(--color-ink)]">
                {preview.botName}
              </div>
              <div className="text-[11.5px] text-[color:var(--color-muted)]">
                {preview.botStatus}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col justify-end gap-1.5 px-1 pb-2">
            {preview.messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function FlowSectionWithPhone() {
  const t = await getTranslations('HowItWorksPage.flow');

  const steps = t.raw('steps') as unknown as TStep[];
  const phonePreview = t.raw('phonePreview') as unknown as TPhonePreview;

  return (
    <Section id="flow" ariaLabelledBy="flow-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-[700px] mx-auto mb-12 text-center">
          <span className="inline-block font-mono text-[12.5px] font-semibold text-[color:var(--color-primary)] tracking-[0.08em] uppercase mb-3">
            {t('kicker')}
          </span>
          <h2
            id="flow-heading"
            className="font-extrabold tracking-[-0.022em] mb-3 leading-[1.1] text-balance text-[color:var(--color-ink)]"
            style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.5rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[16.5px] text-[color:var(--color-muted)] text-pretty">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column: steps + phone */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Ordered list of steps */}
          <ol className="flex flex-col gap-3" aria-label="Шаги пользовательского пути">
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
}
