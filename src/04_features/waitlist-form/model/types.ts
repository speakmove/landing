import type { TWaitlistInput } from './schema';

export type TWaitlistFormState = {
  success: boolean;
  position?: number;
  errors: string[];
  fieldErrors: Partial<Record<keyof TWaitlistInput, string[]>>;
  prev: Partial<Record<keyof TWaitlistInput, string>>;
};
