export type TPricingPlan = {
  id: string;
  name: string;
  badge?: string;
  tagline?: string;
  wasPrice?: { monthly?: string; yearly?: string };
  price: {
    monthly?: { amount: string; period: string } | string;
    yearly?: { amount: string; period: string } | string;
  };
  note?: string;
  features: string[];
  excluded?: string[];
  cta: string;
  ctaStyle?: 'primary' | 'outline';
};
