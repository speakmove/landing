'use client';

import { useTranslations } from 'next-intl';
import type { KeyboardEvent, Ref } from 'react';
import { cn } from '@/shared/model/libs/cn';
import type { TScheduleCard } from '../model/types';

type TProps = {
  card: TScheduleCard;
  selected: boolean;
  onSelect: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  buttonRef: Ref<HTMLDivElement>;
};

export const ScheduleCard = ({ card, selected, onSelect, onKeyDown, buttonRef }: TProps) => {
  const tCommon = useTranslations('Common');
  return (
    <div
      ref={buttonRef}
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      data-active={selected ? 'true' : 'false'}
      className={cn(
        'group/sched relative cursor-pointer rounded-card border-2 border-line bg-white p-7 transition',
        'hover:-translate-y-0.5 hover:shadow-(--shadow-mid)',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'data-[active=true]:border-primary',
        'data-[active=true]:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_14%,transparent),0_4px_10px_rgba(10,22,18,0.05),0_12px_32px_rgba(10,22,18,0.06)]',
      )}
    >
      {card.badge ? (
        <span
          className={cn(
            'absolute right-4.5 top-4.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.04em]',
            'bg-line text-muted',
            'group-data-[active=true]/sched:bg-gold-accent group-data-[active=true]/sched:text-gold-deep',
          )}
        >
          {card.badge}
        </span>
      ) : null}

      <div className="mb-3.5 flex items-center gap-3">
        <span className="grid h-5 w-5 flex-none place-items-center rounded-full border-2 border-line-strong group-data-[active=true]/sched:border-primary">
          <span className="hidden h-2.5 w-2.5 rounded-full bg-primary group-data-[active=true]/sched:block" />
        </span>
        <div>
          <div className="text-lg font-bold leading-tight text-ink">{card.title}</div>
          <div className="m-0 text-13-5 text-muted">{card.subtitle}</div>
        </div>
      </div>

      <p className="mb-4 text-13-5 leading-relaxed text-muted">{card.description}</p>

      <div className="flex gap-1.5" aria-label={tCommon('aria.weekDays')}>
        {card.days.map((day, i) => {
          const isActive = card.activeDays[i] ?? false;
          return (
            <span
              key={day}
              className={cn(
                'grid h-9 flex-1 place-items-center rounded-lg font-mono text-11-5 font-bold',
                isActive
                  ? 'border border-[color-mix(in_oklab,var(--color-primary)_30%,transparent)] bg-primary-pale text-primary-ink'
                  : 'bg-surface text-faint',
              )}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};
