export type TPhoneMessage = {
  from: 'bot' | 'me';
  /** Bubble visual: voice waveform (default) or text correction. */
  kind?: 'voice' | 'correction';
  /** Voice bubbles use this only for a11y; correction bubbles render it with InlineMarkdown (supports **bold**, ~~strikethrough~~, `code`). */
  text: string;
  /** Voice duration, e.g. "0:08". Used by voice kind only. */
  duration?: string;
  /** Small caption rendered above the bubble (e.g. "Voice от бота", "Фидбек на русском"). */
  label?: string;
};

export type TPhoneFloatBubble = {
  title: string;
  subtitle: string;
};
