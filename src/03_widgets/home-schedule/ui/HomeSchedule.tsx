import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ScheduleCard } from '@/entities/schedule-card';
import { ANCHORS } from '@/shared/config';
import type { TScheduleCard } from '@/entities/schedule-card';

type TProps = {
  namespace?: string;
};

export const HomeSchedule = async ({ namespace = 'HomePage.schedule' }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);

  const cards = t.raw('cards') as unknown as TScheduleCard[];

  return (
    <Section
      id={ANCHORS.schedule}
      ariaLabelledBy="schedule-heading"
      className="bg-surface px-5"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="schedule-heading"
          subtitle={t('subtitle')}
        />

        <div className="mx-auto grid max-w-[820px] gap-4 sm:grid-cols-2">
          {cards.map((card, idx) => (
            <ScheduleCard key={card.id} card={card} defaultActive={idx === 0} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
