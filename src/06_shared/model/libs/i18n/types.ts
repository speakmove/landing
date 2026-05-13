import type commonRu from '../../../../../messages/ru/common.json';
import type languageSwitcherRu from '../../../../../messages/ru/languageSwitcher.json';
import type homeRu from '../../../../../messages/ru/home.json';
import type howItWorksRu from '../../../../../messages/ru/howItWorks.json';
import type pricingRu from '../../../../../messages/ru/pricing.json';
import type waitlistRu from '../../../../../messages/ru/waitlist.json';
import type privacyRu from '../../../../../messages/ru/privacy.json';
import type notFoundRu from '../../../../../messages/ru/notFound.json';
import type errorRu from '../../../../../messages/ru/error.json';
import type { routing } from './routing';

export type TLocale = (typeof routing.locales)[number];

export type TMessages = {
  common: typeof commonRu;
  languageSwitcher: typeof languageSwitcherRu;
  home: typeof homeRu;
  howItWorks: typeof howItWorksRu;
  pricing: typeof pricingRu;
  waitlist: typeof waitlistRu;
  privacy: typeof privacyRu;
  notFound: typeof notFoundRu;
  error: typeof errorRu;
};
