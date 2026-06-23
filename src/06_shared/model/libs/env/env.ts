import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z
      .string()
      .url()
      .transform((v) => v.replace(/\/$/, '')),
    NEXT_PUBLIC_INDEXABLE: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_INDEXABLE: process.env.NEXT_PUBLIC_INDEXABLE,
  },
  emptyStringAsUndefined: true,
});
