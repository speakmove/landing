'use client';
import { useTranslations } from 'next-intl';
import { Button, Container, Section } from '@/shared/ui';

type TProps = {
  reset: () => void;
};

export const ErrorPage = ({ reset }: TProps) => {
  const t = useTranslations('Common.error');
  return (
    <Section>
      <Container className="max-w-160 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-muted">
          {t('lead')}
        </p>
        <Button variant="primary" size="lg" className="mt-8" onClick={reset}>
          {t('cta')}
        </Button>
      </Container>
    </Section>
  );
}
