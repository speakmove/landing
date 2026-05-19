'use client';

import { useState } from 'react';
import { useRovingFocus } from '@/shared/model/hooks';

type TItem = { id: string };

type TUseSchedulePickerResult<T extends TItem> = {
  selectedId: string;
  setSelectedId: (id: string) => void;
  registerRef: (idx: number) => (el: HTMLDivElement | null) => void;
  handleKeyDown: (idx: number) => (e: React.KeyboardEvent<HTMLDivElement>) => void;
  items: T[];
};

/**
 * State + WAI-ARIA radiogroup keyboard handling for the schedule picker.
 * Initial selection — first item by `id`.
 */
export const useSchedulePicker = <T extends TItem>(items: T[]): TUseSchedulePickerResult<T> => {
  const firstId = items[0]?.id ?? '';
  const [selectedId, setSelectedId] = useState<string>(firstId);
  const { registerRef, handleKeyDown } = useRovingFocus<T, HTMLDivElement>(items);

  return {
    items,
    selectedId,
    setSelectedId,
    registerRef,
    handleKeyDown: (idx) => handleKeyDown(idx, setSelectedId),
  };
};
