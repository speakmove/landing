import type { TPhoneMessage } from '@/entities/phone-mockup';

export type TPhoneJourneyRole = 'source' | 'target';

export type TPhoneJourneyContent = {
  botName: string;
  messages: TPhoneMessage[];
};
