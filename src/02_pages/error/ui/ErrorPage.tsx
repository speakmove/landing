'use client';
import { useTranslations } from 'next-intl';
import { Button, ButtonLink, Container } from '@/shared/ui';
import { PATHS, URLS } from '@/shared/config';

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

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="lg" onClick={reset}>
            {t('cta')}
          </Button>
          <ButtonLink href={PATHS.home} variant="outline" size="lg">
            {t('ctas.home')}
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-muted">
          {t('ctas.emailLead')}{' '}
          <a
            href={URLS.contactEmail}
            className="text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {URLS.contactEmail.replace('mailto:', '')}
          </a>
        </p>
      </Container>
    </section>
  );
};
