import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Reveal, Section } from '@/shared/ui';
import { FounderCard } from '@/entities/founder-card';
import { ANCHORS } from '@/shared/config';
import type { TFounder } from '@/entities/founder-card';

export const HomeFounderCards = async () => {
  const t = await getTranslations('HomePage.founders');
  const cards = getList<TFounder>(t, 'cards');
  const ctaLabel = t('ctaLabel');

  return (
    <Section
      id={ANCHORS.founders}
      ariaLabelledBy="founders-heading"
      className="bg-gradient-to-b from-primary-pale to-white"
    >
      <Container>
        {/* Heading block animates as one Reveal — same pattern as SectionHead. */}
        <Reveal variant="rise">
          <p className="m-0 mb-3 font-mono text-13 font-semibold uppercase tracking-widest text-primary">
            {t('kicker')}
          </p>
          <h2
            id="founders-heading"
            className="m-0 mb-4 text-3xl font-extrabold leading-tight text-ink md:text-4xl"
          >
            {t('title')}
          </h2>
          <p className="m-0 max-w-2xl text-15 leading-relaxed text-muted">
            {t('subtitle')}
          </p>
        </Reveal>

        <div className="my-10 border-t border-line" aria-hidden="true" />

        {/* Founder mini-stories — each reveals on its own scroll-in */}
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
          {cards.map((founder) => (
            <li key={founder.id}>
              <Reveal variant="rise" className="h-full">
                <FounderCard founder={founder} ctaLabel={ctaLabel} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
