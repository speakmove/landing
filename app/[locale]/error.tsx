'use client';
import { useEffect } from 'react';
import { ErrorPage } from '@/pages/error';

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: TProps) {
  useEffect(() => {
    console.error('[locale-error]', error);
  }, [error]);
  return <ErrorPage reset={reset} />;
}
