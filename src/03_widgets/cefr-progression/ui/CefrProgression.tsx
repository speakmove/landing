import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { CefrLevelRow } from '@/entities/cefr-level';
import type { TCefrLevel } from '@/entities/cefr-level';

/** Parse **bold** markdown inline — pure React JSX, no unsafe HTML injection */
function BoldText({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-ink font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

type TSideData = {
  title: string;
  items: string[];
};

export async function CefrProgression() {
  const t = await getTranslations('HowItWorksPage.cefr');

  const levels = t.raw('levels') as unknown as TCefrLevel[];
  const side = t.raw('side') as unknown as TSideData;

  return (
    <Section id="cefr" ariaLabelledBy="cefr-heading">
      <Container>
        {/* Section header */}
        <div className="max-w-[700px] mx-auto mb-12 text-center">
          <span className="inline-block font-mono text-xs font-semibold text-primary tracking-[0.08em] uppercase mb-3">
            {t('kicker')}
          </span>
          <h2
            id="cefr-heading"
            className="font-extrabold tracking-[-0.022em] mb-3 leading-[1.1] text-balance text-ink"
            style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.5rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-base text-muted text-pretty">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column: levels list + side panel */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-9 items-start">
          {/* CEFR levels ordered list */}
          <ol className="flex flex-col gap-2.5" aria-label="Уровни CEFR">
            {levels.map((level) => (
              <CefrLevelRow key={level.code} level={level} />
            ))}
          </ol>

          {/* Side panel */}
          <aside
            aria-labelledby="cefr-side-heading"
            className="rounded-[18px] border border-line bg-white p-7 shadow-(--shadow-soft)"
          >
            <h3
              id="cefr-side-heading"
              className="mb-3.5 text-lg font-bold tracking-[-0.01em] text-ink"
            >
              {side.title}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {side.items.map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start text-muted leading-relaxed">
                  {/* Check icon — decorative */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-none mt-0.5 text-primary shrink-0"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>
                    <BoldText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
