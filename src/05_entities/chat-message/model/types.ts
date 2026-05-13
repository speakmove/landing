export type TChatMessage = {
  from: 'bot' | 'me';
  text?: string;
  translation?: string;
  meta?: string;
  reward?: string;
  highlight?: string;
  /** voice message bubble */
  type?: 'voice' | 'homework';
  duration?: string;
};
