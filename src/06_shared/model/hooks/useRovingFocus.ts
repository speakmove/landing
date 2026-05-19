'use client';

import { useCallback, useRef, type KeyboardEvent } from 'react';

type TItem = { id: string };

type TUseRovingFocusOptions = {
  orientation?: 'horizontal' | 'vertical' | 'both';
};

type TUseRovingFocusResult<E extends HTMLElement> = {
  registerRef: (idx: number) => (el: E | null) => void;
  handleKeyDown: (idx: number, onSelect: (id: string) => void) => (e: KeyboardEvent<E>) => void;
};

const NEXT_KEYS_BY_ORIENTATION: Record<'horizontal' | 'vertical' | 'both', readonly string[]> = {
  horizontal: ['ArrowRight'],
  vertical: ['ArrowDown'],
  both: ['ArrowRight', 'ArrowDown'],
};
const PREV_KEYS_BY_ORIENTATION: Record<'horizontal' | 'vertical' | 'both', readonly string[]> = {
  horizontal: ['ArrowLeft'],
  vertical: ['ArrowUp'],
  both: ['ArrowLeft', 'ArrowUp'],
};
const SELECT_KEYS = new Set([' ', 'Enter']);

/**
 * WAI-ARIA roving-focus pattern for radiogroup / tablist / menu.
 *
 * - Arrow keys move focus to siblings and invoke `onSelect(nextId)`.
 * - Space / Enter select the currently focused item.
 * - Home / End jump to first / last.
 *
 * `orientation` defaults to `both`, accepting all four arrow keys. Set to
 * `horizontal` or `vertical` to restrict.
 */
export const useRovingFocus = <T extends TItem, E extends HTMLElement = HTMLDivElement>(
  items: T[],
  { orientation = 'both' }: TUseRovingFocusOptions = {},
): TUseRovingFocusResult<E> => {
  const refs = useRef<(E | null)[]>([]);

  const registerRef = useCallback(
    (idx: number) => (el: E | null) => {
      refs.current[idx] = el;
    },
    [],
  );

  const handleKeyDown = useCallback(
    (idx: number, onSelect: (id: string) => void) => (e: KeyboardEvent<E>) => {
      const nextKeys = NEXT_KEYS_BY_ORIENTATION[orientation];
      const prevKeys = PREV_KEYS_BY_ORIENTATION[orientation];
      const count = items.length;
      if (count === 0) return;

      let nextIdx: number | null = null;
      if (nextKeys.includes(e.key)) nextIdx = (idx + 1) % count;
      else if (prevKeys.includes(e.key)) nextIdx = (idx - 1 + count) % count;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = count - 1;
      else if (SELECT_KEYS.has(e.key)) {
        e.preventDefault();
        const current = items[idx];
        if (current) onSelect(current.id);
        return;
      } else {
        return;
      }

      e.preventDefault();
      const next = items[nextIdx];
      if (!next) return;
      onSelect(next.id);
      refs.current[nextIdx]?.focus();
    },
    [items, orientation],
  );

  return { registerRef, handleKeyDown };
};
