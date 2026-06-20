import { cn } from '@/shared/model/libs/cn';
import type { TPriceModeData, TPriceModeId } from '../model/types';

type TProps = {
  modes: TPriceModeData[];
  activeId: TPriceModeId;
  onSelect: (id: TPriceModeId) => void;
  /** Base id used to give each tab a stable, unique DOM id. */
  groupId: string;
  /** Accessible label for the tablist (the active mode's label). */
  label: string;
};

/**
 * Segment control for the price toggle — a `tablist` of three buttons.
 *
 * Purely presentational: it owns no state. The active id and selection
 * callback come from the orchestrating `PriceToggle`. It is always rendered
 * inside that client tree, so it needs no `'use client'` directive of its own.
 */
export const SegmentControl = ({
  modes,
  activeId,
  onSelect,
  groupId,
  label,
}: TProps) => (
  <div
    role="tablist"
    aria-label={label}
    className="mt-5 grid w-full grid-cols-3 gap-1 rounded-full bg-white/12 p-1"
  >
    {modes.map((mode) => {
      const selected = mode.id === activeId;
      return (
        <button
          key={mode.id}
          type="button"
          role="tab"
          id={`${groupId}-${mode.id}`}
          aria-selected={selected}
          onClick={() => onSelect(mode.id)}
          className={cn(
            'min-w-0 cursor-pointer text-balance rounded-full px-2 py-2 text-center text-13 font-semibold leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-13-5',
            selected
              ? 'bg-white text-primary-ink'
              : 'text-white/70 hover:text-white',
          )}
        >
          {mode.label}
        </button>
      );
    })}
  </div>
);
