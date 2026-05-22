'use client';

import { useEffect, useRef } from 'react';
import { usePhoneJourneyContext } from '../store';
import type { TPhoneJourneyRole } from '../types';

export const usePhoneJourneyAnchor = (role: TPhoneJourneyRole) => {
  const ref = useRef<HTMLElement | null>(null);
  const { registerAnchor, unregisterAnchor } = usePhoneJourneyContext();

  useEffect(() => {
    registerAnchor(role, ref);
    return () => unregisterAnchor(role);
  }, [role, registerAnchor, unregisterAnchor]);

  return ref;
};
