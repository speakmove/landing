'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren, RefObject } from 'react';
import type { TPhoneJourneyContent, TPhoneJourneyRole } from './types';

type TRegistry = {
  source: RefObject<HTMLElement | null> | null;
  target: RefObject<HTMLElement | null> | null;
};

type TPhoneJourneyContext = {
  /** Live anchor registry. Stable RefObject — safe to read .current in effects/event handlers. */
  registryRef: RefObject<TRegistry>;
  /** Monotonically increments on every register/unregister — consumers depend on it to recompute. */
  registryVersion: number;
  registerAnchor: (role: TPhoneJourneyRole, ref: RefObject<HTMLElement | null>) => void;
  unregisterAnchor: (role: TPhoneJourneyRole) => void;
  activeContent: TPhoneJourneyContent | null;
  setActiveContent: (content: TPhoneJourneyContent | null) => void;
};

const PhoneJourneyContext = createContext<TPhoneJourneyContext | null>(null);

export const PhoneJourneyProvider = ({ children }: PropsWithChildren) => {
  const registryRef = useRef<TRegistry>({ source: null, target: null });
  const [registryVersion, setRegistryVersion] = useState(0);
  const [activeContent, setActiveContent] = useState<TPhoneJourneyContent | null>(null);

  const registerAnchor = useCallback(
    (role: TPhoneJourneyRole, ref: RefObject<HTMLElement | null>) => {
      registryRef.current = { ...registryRef.current, [role]: ref };
      setRegistryVersion((v) => v + 1);
    },
    [],
  );

  const unregisterAnchor = useCallback((role: TPhoneJourneyRole) => {
    registryRef.current = { ...registryRef.current, [role]: null };
    setRegistryVersion((v) => v + 1);
  }, []);

  const value = useMemo<TPhoneJourneyContext>(
    () => ({
      registryRef,
      registryVersion,
      registerAnchor,
      unregisterAnchor,
      activeContent,
      setActiveContent,
    }),
    [registryVersion, registerAnchor, unregisterAnchor, activeContent],
  );

  return <PhoneJourneyContext.Provider value={value}>{children}</PhoneJourneyContext.Provider>;
};

export const usePhoneJourneyContext = () => {
  const ctx = useContext(PhoneJourneyContext);
  if (!ctx) throw new Error('usePhoneJourneyContext must be used within PhoneJourneyProvider');
  return ctx;
};
