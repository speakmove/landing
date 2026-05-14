import { z } from 'zod';

export const WaitlistSchema = z.object({
  firstName: z.string().trim().min(1, 'firstName.required').max(100),
  lastName: z.string().trim().max(100).optional().default(''),
  email: z.string().trim().email('email.invalid'),
  segment: z.enum(['parent', 'self', 'both'], { message: 'segment.required' }),
  lang: z.enum(['en', 'de', 'no', 'other']).optional(),
  country: z.string().trim().min(1, 'country.required'),
  plan: z.string().trim().min(1, 'plan.required'),
  consent: z.literal('on', { message: 'consent.required' }),
  website: z.string().optional(),
});

export type TWaitlistInput = z.infer<typeof WaitlistSchema>;
