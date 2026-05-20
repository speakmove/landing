'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * State + a11y plumbing for the mobile menu drawer:
 *  - open/close API exposed via state + close() callback
 *  - ESC closes the menu
 *  - while open, body scroll is locked and focus is moved to the first
 *    link; on close, focus returns to the trigger button
 *
 * Caller wires the returned refs to the trigger button and the first
 * focusable link inside the drawer.
 */
export const useMobileMenuState = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => setOpen(true), []);

  // ESC closes the menu while it's open.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, close]);

  // Lock body scroll + focus first link on open; restore on close.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tid = window.setTimeout(() => firstLinkRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(tid);
    };
  }, [open]);

  return { open, openMenu, close, buttonRef, firstLinkRef };
};
