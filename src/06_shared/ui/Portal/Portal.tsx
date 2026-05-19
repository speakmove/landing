'use client';

import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

type TProps = {
  children: ReactNode;
};

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * SSR-safe portal that mounts its children at the end of `document.body`.
 * Lets fixed-position overlays escape any ancestor stacking context created by
 * `backdrop-filter`, `transform`, `will-change`, etc.
 *
 * `useSyncExternalStore` is the lint-clean way to detect "we are on the client"
 * — server snapshot returns `false`, client snapshot returns `true`, no effect needed.
 */
export const Portal = ({ children }: TProps) => {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!isClient) return null;
  return createPortal(children, document.body);
};
