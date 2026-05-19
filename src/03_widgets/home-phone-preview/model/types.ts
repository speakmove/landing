export type TPhoneMessage = {
  from: 'bot' | 'me';
  /** `voice` (play+waveform bubble) or `feedback` (text bubble with corrections). */
  kind?: 'voice' | 'feedback';
  text: string;
  /** Optional duration like "0:08" shown on voice bubbles. */
  duration?: string;
  /** Small label rendered above the bubble (e.g. "Voice from bot", "Correction"). */
  label?: string;
  translation?: string;
  meta?: string;
  reward?: string;
  highlight?: string;
};

export type TPhoneFloatBubble = {
  title: string;
  subtitle: string;
};
