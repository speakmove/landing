'use client';

import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Section, SectionHead } from '@/shared/ui';
import { ScheduleCard } from '@/entities/schedule-card';
import { ANCHORS } from '@/shared/config';
import type { TScheduleCard } from '@/entities/schedule-card';

type TProps = {
  namespace?: string;
};

export const HomeSchedule = ({ namespace = 'HomePage.schedule' }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(namespace as any);
  const tCommon = useTranslations('Common');

  const cards = t.raw('cards') as unknown as TScheduleCard[];
  const firstId = cards[0]?.id ?? '';
  const [selectedId, setSelectedId] = useState<string>(firstId);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (idx: number) => (e: KeyboardEvent<HTMLDivElement>) => {
      let nextIdx = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIdx = (idx + 1) % cards.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIdx = (idx - 1 + cards.length) % cards.length;
      } else if (e.key === 'Home') {
        nextIdx = 0;
      } else if (e.key === 'End') {
        nextIdx = cards.length - 1;
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const target = cards[idx];
        if (target) setSelectedId(target.id);
        return;
      } else {
        return;
      }

      e.preventDefault();
      const next = cards[nextIdx];
      if (next) {
        setSelectedId(next.id);
        cardRefs.current[nextIdx]?.focus();
      }
    },
    [cards],
  );

  return (
    <Section
      id={ANCHORS.schedule}
      ariaLabelledBy="schedule-heading"
      className="bg-surface"
    >
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
              buttonRef={(el) => {
                cardRefs.current[idx] = el;
              }}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
