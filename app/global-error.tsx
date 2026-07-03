'use client';
import { useEffect } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorPage } from '@/pages/error';
import './globals.css';

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Root layout (and its NextIntlClientProvider) is gone by the time this
// renders, so the locale can't be resolved the normal way — English only.
const MESSAGES = {
  Common: {
    error: {
      title: 'Something went wrong',
      lead: "We're looking into it. Try refreshing the page.",
      cta: 'Refresh',
      ctas: {
        home: 'Back to home',
        emailLead: 'Or email us directly:',
      },
    },
  },
};

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['500', '600'],
});

export default function GlobalError({ error, reset }: TProps) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-svh flex-col">
        <NextIntlClientProvider locale="en" messages={MESSAGES}>
          <main className="flex min-w-0 flex-1 flex-col">
            <ErrorPage reset={reset} />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
