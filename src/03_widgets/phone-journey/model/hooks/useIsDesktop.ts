'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 1024px)';

const subscribe = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
};

const getServerSnapshot = () => false;

export const useIsDesktop = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
