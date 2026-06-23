'use client';
import { useTranslations } from 'next-intl';
import { Button, Container } from '@/shared/ui';

type TProps = {
  reset: () => void;
};

export const ErrorPage = ({ reset }: TProps) => {
  const t = useTranslations('Common.error');
  return (
    <section className="error-screen">
      <div className="err-bignum" aria-hidden="true">
        500
      </div>

      <Container className="relative z-10 w-full max-w-160">
        <h1 className="h-display-section mb-3.5 font-extrabold leading-[1.1] tracking-tight text-balance text-ink">
          {t('title')}
        </h1>
        <p className="mx-auto mb-9 max-w-135 text-pretty text-17 text-muted">
          {t('lead')}
        </p>
        <Button variant="primary" size="lg" onClick={reset}>
          {t('cta')}
        </Button>
      </Container>
    </section>
  );
};
