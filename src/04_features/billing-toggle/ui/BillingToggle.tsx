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

  return (
    <div
      role="tablist"
      aria-label={tCommon('aria.billingPeriod')}
      onKeyDown={handleKeyDown}
      className="inline-flex rounded-xl border border-line bg-surface p-1 gap-1"
    >
      <button
        ref={(el) => { tabRefs.current[0] = el; }}
        role="tab"
        aria-selected={value === 'monthly'}
        tabIndex={value === 'monthly' ? 0 : -1}
        onClick={() => onChange('monthly')}
        className={cn(
          'min-h-9 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          value === 'monthly'
            ? 'bg-white text-ink shadow-(--shadow-soft)'
            : 'text-muted hover:text-ink',
        )}
      >
        {monthlyLabel}
      </button>

      <button
        ref={(el) => { tabRefs.current[1] = el; }}
        role="tab"
        aria-selected={value === 'yearly'}
        tabIndex={value === 'yearly' ? 0 : -1}
        onClick={() => onChange('yearly')}
        className={cn(
          'min-h-9 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center gap-2',
          value === 'yearly'
            ? 'bg-white text-ink shadow-(--shadow-soft)'
            : 'text-muted hover:text-ink',
        )}
      >
        {yearlyLabel}
        <span className="rounded-full bg-gold-pale border border-gold px-2 py-0.5 text-[11px] font-bold text-ink">
          {yearlySaveLabel}
        </span>
      </button>
    </div>
  );
}
