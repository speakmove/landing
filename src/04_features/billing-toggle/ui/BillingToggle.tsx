'use client';

import { useCallback, useRef, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/model/libs/cn';

export type TBillingValue = 'monthly' | 'yearly';

type TProps = {
  value: TBillingValue;
  onChange: (v: TBillingValue) => void;
  monthlyLabel: string;
  yearlyLabel: string;
  yearlySaveLabel: string;
};

const OPTIONS: TBillingValue[] = ['monthly', 'yearly'];

export const BillingToggle = ({
  value,
  onChange,
  monthlyLabel,
  yearlyLabel,
  yearlySaveLabel,
}: TProps) => {
  const tCommon = useTranslations('Common');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = OPTIONS.indexOf(value);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % OPTIONS.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + OPTIONS.length) % OPTIONS.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = OPTIONS.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const next = OPTIONS[nextIndex];
      if (next) {
        onChange(next);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    [value, onChange],
  );

  const baseBtn =
    'inline-flex items-center rounded-full px-4 py-2 text-13-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const activeBtn = 'bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,.08)]';
  const inactiveBtn = 'text-muted hover:text-ink';

  return (
    <div
      role="tablist"
      aria-label={tCommon('aria.billingPeriod')}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="inline-flex items-center gap-1 rounded-full bg-[#f1f3ef] p-1"
    >
      <button
        ref={(el) => {
          tabRefs.current[0] = el;
        }}
        type="button"
        role="tab"
        aria-selected={value === 'monthly'}
        tabIndex={value === 'monthly' ? 0 : -1}
        onClick={() => onChange('monthly')}
        className={cn(baseBtn, value === 'monthly' ? activeBtn : inactiveBtn)}
      >
        {monthlyLabel}
      </button>

      <button
        ref={(el) => {
          tabRefs.current[1] = el;
        }}
        type="button"
        role="tab"
        aria-selected={value === 'yearly'}
        tabIndex={value === 'yearly' ? 0 : -1}
        onClick={() => onChange('yearly')}
        className={cn(baseBtn, value === 'yearly' ? activeBtn : inactiveBtn, 'gap-1.5')}
      >
        {yearlyLabel}
        <span className="text-mini font-bold text-primary">{yearlySaveLabel}</span>
      </button>
    </div>
  );
};
