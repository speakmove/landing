export type TPhoneMessage = {
  from: 'bot' | 'me';
  text: string;
  translation?: string;
  meta?: string;
  reward?: string;
  highlight?: string;
};

export type TPhoneFloatBubble = {
  title: string;
  subtitle: string;
};
