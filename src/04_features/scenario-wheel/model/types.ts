/** Serialisable props for a single editorial row passed from RSC → client island. */
export type TScenarioRowProps = {
  /** Zero-padded row number string, e.g. "01", "02". */
  number: string;
  title: string;
  aiRole: string;
  hook: string;
  duration: string;
  /** Pre-built Telegram bot deep-link URL. */
  href: string;
  /** Accessible label for the anchor (ctaLabel + " — " + title). */
  ariaLabel: string;
};
