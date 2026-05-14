'use server';

import { WaitlistSchema } from '../model/schema';
import { SERVER_ERROR_KEY } from '../model/constants';
import type { TWaitlistFormState } from '../model/types';

export async function submitWaitlist(
  _prev: TWaitlistFormState,
  formData: FormData,
): Promise<TWaitlistFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const prev: TWaitlistFormState['prev'] = {
    firstName: raw['firstName'] ?? '',
    lastName: raw['lastName'] ?? '',
    email: raw['email'] ?? '',
    segment: raw['segment'] ?? '',
    lang: raw['lang'] ?? '',
    country: raw['country'] ?? '',
    plan: raw['plan'] ?? '',
  };

  // Honeypot: silent success on bot fill
  if (typeof raw['website'] === 'string' && raw['website'].length > 0) {
    console.warn('[waitlist:honeypot-triggered]');
    return { success: true, position: 999, errors: [], fieldErrors: {}, prev };
  }

  const parsed = WaitlistSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: [],
      fieldErrors: parsed.error.flatten().fieldErrors,
      prev,
    };
  }

  try {
    console.log('[waitlist:stub]', parsed.data);
    // Stub: assign position 158 (current+1 from WaitlistPage.form.progress.current=157)
    return { success: true, position: 158, errors: [], fieldErrors: {}, prev };
  } catch (error) {
    console.error('[waitlist:server-error]', error);
    return {
      success: false,
      errors: [SERVER_ERROR_KEY],
      fieldErrors: {},
      prev,
    };
  }
}
