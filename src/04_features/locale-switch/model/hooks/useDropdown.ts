'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type TUseDropdownReturn = {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerProps: {
    'aria-expanded': boolean;
    'aria-haspopup': 'listbox';
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
};

export const useDropdown = (): TUseDropdownReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) === false &&
        menuRef.current?.contains(target) === false
      ) {
        close();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, close]);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  return {
    isOpen,
    triggerRef,
    menuRef,
    open,
    close,
    toggle,
    triggerProps: {
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox',
      onClick: toggle,
      onKeyDown: handleTriggerKeyDown,
    },
  };
};
