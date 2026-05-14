import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { env } from '@/shared/model/libs/env';

// metadataBase lives here so it is available as a static export during
// static generation, preventing "metadataBase not set" warnings when
// Next.js resolves inherited OG image URLs in child routes.
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
};

export default function RootLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
