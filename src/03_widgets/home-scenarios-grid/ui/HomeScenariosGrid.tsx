import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { ArrowRightIcon, Container, Section, SectionHead } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { ANCHORS } from '@/shared/config';

type TCard = {
  id: string;
  title: string;
  aiRole: string;
  hook: string;
  duration: string;
};

export const HomeScenariosGrid = async () => {
  const t = await getTranslations('HomePage.scenariosGrid');
  const locale = await getLocale();
  const cards = getList<TCard>(t, 'cards');
  const ctaLabel = t('ctaLabel');

  return (
    <Section
      id={ANCHORS.scenarios}
      ariaLabelledBy="scenarios-grid-heading"
      className="py-14 md:py-20"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="scenarios-grid-heading"
          subtitle={t('subtitle')}
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.id} className="contents">
              <a
                href={buildBotUrl(locale, card.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group relative flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-(--shadow-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`${ctaLabel} — ${card.title}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="m-0 text-lg font-bold tracking-tight text-ink">
                    {card.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-mini font-semibold text-muted">
                    {card.duration}
                  </span>
                </div>
                <p className="m-0 mt-1.5 text-13 font-medium text-primary">{card.aiRole}</p>
                <p className="m-0 mt-3 flex-1 text-14-5 leading-relaxed text-muted">{card.hook}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-[gap] group-hover:gap-2">
                  {ctaLabel}
                  <ArrowRightIcon size={14} />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
