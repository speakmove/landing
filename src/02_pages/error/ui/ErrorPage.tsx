'use client';
import { Button, Container, Section } from '@/shared/ui';

type TProps = {
  reset: () => void;
};

export function ErrorPage({ reset }: TProps) {
  return (
    <Section>
      <Container className="max-w-[640px] text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Что-то пошло не так
        </h1>
        <p className="mt-3 text-[color:var(--color-muted)]">
          Мы уже разбираемся. Попробуйте обновить страницу.
        </p>
        <Button variant="primary" size="lg" className="mt-8" onClick={reset}>
          Обновить
        </Button>
      </Container>
    </Section>
  );
}
