export type TPricingCardData = {
  badge: string;
  title: string;
  /** Optional kicker between title and features (home teaser uses this). */
  subtitle?: string;
  perDay: string;
  perDayUnit: string;
  perMonth: string;
  /** Tiny line under the per-month price (full plan card uses this). */
  subprice?: string;
  features: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  /** Optional secondary inline link (home teaser uses "see details"). */
  secondaryLink?: { label: string; href: string };
  footnote: string;
};

export type TPricingCardVariant = {
  /**
   * `compact` = narrow plan card on /pricing.
   * `wide` = home teaser with bigger padding and a 2-col feature grid.
   * `split` = raised accent card: emerald left panel (badge + price slot + CTA
   *           + footnote) and white "what's included" right panel.
   */
  size?: 'compact' | 'wide' | 'split';
};
