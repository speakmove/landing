export const PATHS = {
  home: '/',
  howItWorks: '/how-it-works',
  pricing: '/pricing',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
} as const;

export type TPath = (typeof PATHS)[keyof typeof PATHS];
