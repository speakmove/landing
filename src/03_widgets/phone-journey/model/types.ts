import type { RefObject } from 'react';
import type { TPhoneMessage } from '@/entities/phone-mockup';

export type TPhoneJourneyRole = 'source' | 'target';

export type TPhoneJourneyAnchor = {
  role: TPhoneJourneyRole;
  ref: RefObject<HTMLElement | null>;
};

export type TPhoneJourneyContent = {
  botName: string;
  messages: TPhoneMessage[];
};
