'use client';

import { useCallback, useRef, type KeyboardEvent } from 'react';
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

export function BillingToggle({
  value,
  onChange,
  monthlyLabel,
  yearlyLabel,
  yearlySaveLabel,
}: TProps) {
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
      aria-label="Период оплаты"
      onKeyDown={handleKeyDown}
      className="inline-flex rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-1 gap-1"
    >
      <button
        ref={(el) => { tabRefs.current[0] = el; }}
        role="tab"
        aria-selected={value === 'monthly'}
        tabIndex={value === 'monthly' ? 0 : -1}
        onClick={() => onChange('monthly')}
        className={cn(
          'min-h-[36px] rounded-lg px-4 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]',
          value === 'monthly'
            ? 'bg-white text-[color:var(--color-ink)] shadow-[var(--shadow-soft)]'
            : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]',
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
          'min-h-[36px] rounded-lg px-4 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)] flex items-center gap-2',
          value === 'yearly'
            ? 'bg-white text-[color:var(--color-ink)] shadow-[var(--shadow-soft)]'
            : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]',
        )}
      >
        {yearlyLabel}
        <span className="rounded-full bg-[color:var(--color-gold-pale)] border border-[color:var(--color-gold)] px-2 py-0.5 text-[11px] font-bold text-[color:var(--color-ink)]">
          {yearlySaveLabel}
        </span>
      </button>
    </div>
  );
}
