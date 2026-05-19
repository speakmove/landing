'use client';

import { useTranslations } from 'next-intl';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ScheduleCard } from '@/entities/schedule-card';
import type { TScheduleCard } from '@/entities/schedule-card';
import { useSchedulePicker } from '@/features/schedule-picker';
import { ANCHORS } from '@/shared/config';

type TProps = {
  namespace?: string;
};

export const HomeSchedule = ({ namespace = 'HomePage.schedule' }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(namespace as any);
  const tCommon = useTranslations('Common');

  const cards = t.raw('cards') as unknown as TScheduleCard[];
  const { selectedId, setSelectedId, registerRef, handleKeyDown } = useSchedulePicker(cards);

  return (
    <Section id={ANCHORS.schedule} ariaLabelledBy="schedule-heading" className="bg-surface">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="schedule-heading"
          subtitle={t('subtitle')}
        />

        <div
          role="radiogroup"
          aria-labelledby="schedule-heading"
          aria-label={tCommon('aria.schedulePicker')}
          className="mx-auto grid max-w-205 gap-4 sm:grid-cols-2"
        >
          {cards.map((card, idx) => (
            <ScheduleCard
              key={card.id}
              card={card}
              selected={selectedId === card.id}
              onSelect={() => setSelectedId(card.id)}
              onKeyDown={handleKeyDown(idx)}
              buttonRef={registerRef(idx)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
