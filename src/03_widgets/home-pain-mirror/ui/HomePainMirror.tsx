import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, DoubleCheckIcon, Section } from '@/shared/ui';
import { Reveal } from '@/features/reveal';
import { buildBotUrl } from '@/shared/model/utils';

type TLine = {
  text: string;
  scenarioId: string;
  scenarioLabel: string;
};

export const HomePainMirror = async () => {
  const t = await getTranslations('HomePage.painMirror');
  const locale = await getLocale();
  const lines = getList<TLine>(t, 'lines');
  const timeLabels = getList<string>(t, 'timeLabels');

  return (
    <Section
      ariaLabelledBy="pain-mirror-chat-heading"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <div className="mx-auto max-w-xl">
          <h2
            id="pain-mirror-chat-heading"
            className="m-0 text-center font-mono text-sm font-semibold uppercase tracking-[0.08em] text-primary"
          >
            {t('eyebrow')}
          </h2>

          <Reveal variant="up">
            <ul className="mt-8 m-0 list-none space-y-2 p-0">
              {lines.map((line, idx) => (
                <li key={line.scenarioId} className="flex justify-end">
                  <div className="relative max-w-[85%] rounded-2xl rounded-br-md bg-tg-bubble-me px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                    <p className="m-0 text-15 leading-snug text-tg-bubble-me-ink">
                      {line.text}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-mini text-tg-bubble-me-accent">
                      <span>{timeLabels[idx] ?? ''}</span>
                      <DoubleCheckIcon size={12} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-start">
              <div className="relative max-w-[90%] rounded-2xl rounded-bl-md border border-line bg-white px-4 py-4 shadow-(--shadow-soft)">
                <p className="m-0 mb-3 text-15 font-semibold leading-snug text-ink">
                  {t('botReply')}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {lines.map((line) => (
                    <li key={line.scenarioId}>
                      <a
                        href={buildBotUrl(locale, line.scenarioId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-primary/30 bg-primary-pale px-3 py-1 text-13 font-semibold text-primary-ink transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {line.scenarioLabel}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-lg text-balance text-center text-17 leading-relaxed text-muted">
              {t('bridge')}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};
