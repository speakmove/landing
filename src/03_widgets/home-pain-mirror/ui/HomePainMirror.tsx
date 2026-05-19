import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';

export const HomePainMirror = async () => {
  const t = await getTranslations('HomePage.painMirror');
  const lines = t.raw('lines') as unknown as string[];

  return (
    <Section
      ariaLabelledBy="pain-mirror-heading"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <div className="mx-auto max-w-2xl">
          <h2
            id="pain-mirror-heading"
            className="m-0 text-center font-mono text-sm font-semibold uppercase tracking-[0.08em] text-primary"
          >
            {t('eyebrow')}
          </h2>

          <ul className="mx-auto mt-7 m-0 max-w-xl list-none space-y-3.5 p-0">
            {lines.map((line) => (
              <li
                key={line}
                className="rounded-card border border-line bg-white px-5 py-4 text-15-5 leading-snug text-ink shadow-(--shadow-soft)"
              >
                {line}
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-xl text-balance text-center text-17 leading-relaxed text-muted">
            {t('bridge')}
          </p>
        </div>
      </Container>
    </Section>
  );
};
