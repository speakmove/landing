import { getLocale, getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { ArrowRightIcon, Container, Section, SectionHead } from '@/shared/ui';
import { Reveal } from '@/features/reveal';
import { buildBotUrl } from '@/shared/model/utils';
import { ANCHORS } from '@/shared/config';
import { ScenariosDesktopJourney } from './ScenariosDesktopJourney';
import type { TScenarioCard } from '../model/types';

export const HomeScenariosGrid = async () => {
  const t = await getTranslations('HomePage.scenariosGrid');
  const locale = await getLocale();
  const cards = getList<TScenarioCard>(t, 'cards');
  const ctaLabel = t('ctaLabel');
  const kicker = t('kicker');
  const title = t('title');
  const subtitle = t('subtitle');

  return (
    <Section id={ANCHORS.scenarios} ariaLabelledBy="scenarios-grid-heading">
      {/* DESKTOP — sticky phone journey with 8 stops */}
      <ScenariosDesktopJourney
        cards={cards}
        locale={locale}
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
      />

      {/* MOBILE — grid with reveal stagger */}
      <Container className="py-14 md:py-20 lg:hidden">
        <SectionHead
          kicker={kicker}
          title={title}
          titleId="scenarios-grid-heading"
          subtitle={subtitle}
        />

        <Reveal
          variant="up"
          stagger={0.05}
          className="m-0 mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2"
        >
          {cards.map((card) => (
            <a
              key={card.id}
              href={buildBotUrl(locale, card.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group relative flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-(--shadow-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`${ctaLabel} — ${card.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="m-0 text-lg font-bold tracking-tight text-ink">{card.title}</h3>
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
          ))}
        </Reveal>
      </Container>
    </Section>
  );
};
