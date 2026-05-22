import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { ArrowRightIcon, Container, Section, SectionHead } from '@/shared/ui';
import { Reveal } from '@/features/reveal';
import { safeHrefOrFallback } from '@/shared/model/utils';
import { ANCHORS } from '@/shared/config';

type TFounder = {
  id: string;
  name: string;
  role: string;
  initials: string;
  story: string;
  telegramHandle: string;
  telegramUrl: string;
};

export const HomeFounderCards = async () => {
  const t = await getTranslations('HomePage.founders');
  const cards = getList<TFounder>(t, 'cards');
  const ctaLabel = t('ctaLabel');

  return (
    <Section
      id={ANCHORS.founders}
      ariaLabelledBy="founders-heading"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="founders-heading"
          subtitle={t('subtitle')}
        />

        <Reveal variant="up">
          <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
          {cards.map((founder) => (
            <li
              key={founder.id}
              className="rounded-card-lg border border-line bg-white p-6 shadow-(--shadow-soft) md:p-8"
            >
              <header className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-pale font-mono text-2xl font-extrabold text-primary-ink"
                >
                  {founder.initials}
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-lg font-bold text-ink">{founder.name}</p>
                  <p className="mt-0.5 m-0 text-13 text-muted">{founder.role}</p>
                </div>
              </header>

              <p className="mt-5 m-0 text-15 leading-relaxed text-ink">
                {founder.story}
              </p>

              <a
                href={safeHrefOrFallback(founder.telegramUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-[gap] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {ctaLabel} {founder.telegramHandle}
                <ArrowRightIcon size={14} />
              </a>
            </li>
          ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
};
