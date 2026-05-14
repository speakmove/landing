import { getTranslations } from 'next-intl/server';
import { CheckIcon, Container, Section, SectionHead } from '@/shared/ui';
import { CefrLevelRow } from '@/entities/cefr-level';
import type { TCefrLevel } from '@/entities/cefr-level';

/** Parse **bold** markdown inline — pure React JSX, no unsafe HTML injection */
const BoldText = ({ text }: { text: string }) => {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

type TSideData = {
  title: string;
  items: string[];
};

export const CefrProgression = async () => {
  const t = await getTranslations('HowItWorksPage.cefr');
  const tCommon = await getTranslations('Common');

  const levels = t.raw('levels') as unknown as TCefrLevel[];
  const side = t.raw('side') as unknown as TSideData;

  return (
    <Section id="cefr" ariaLabelledBy="cefr-heading" className="px-5 py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="cefr-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid items-center gap-9 lg:grid-cols-[1.1fr_1fr]">
          <ol className="flex flex-col gap-2.5" aria-label={tCommon('aria.cefrLevels')}>
            {levels.map((level) => (
              <CefrLevelRow key={level.code} level={level} />
            ))}
          </ol>

          <aside
            aria-labelledby="cefr-side-heading"
            className="rounded-[18px] border border-line bg-white p-7 shadow-(--shadow-soft)"
          >
            <h3
              id="cefr-side-heading"
              className="m-0 mb-3.5 text-[19px] font-bold tracking-[-0.01em] text-ink"
            >
              {side.title}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
              {side.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 leading-[1.5] text-muted"
                >
                  <CheckIcon
                    size={18}
                    strokeWidth={3}
                    className="mt-0.5 flex-none text-primary"
                  />
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
};
