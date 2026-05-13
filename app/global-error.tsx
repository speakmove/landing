'use client';
import { useEffect } from 'react';

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: TProps) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <button type="button" onClick={reset} style={{ marginTop: '1rem' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
