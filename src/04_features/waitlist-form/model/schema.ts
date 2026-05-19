import { z } from 'zod';

export const WaitlistSchema = z.object({
  firstName: z.string().trim().min(1, 'firstName.required').max(100),
  email: z.string().trim().email('email.invalid'),
  segment: z.enum(['parent', 'self', 'both'], { message: 'segment.required' }),
  lang: z.enum(['en', 'de', 'no', 'other']).optional(),
  country: z.string().trim().min(1, 'country.required'),
  plan: z.enum(['plus', 'premium', 'undecided'], { message: 'plan.required' }),
  consent: z.literal('on', { message: 'consent.required' }),
  company_url: z.string().optional(),
});

export type TWaitlistInput = z.infer<typeof WaitlistSchema>;
