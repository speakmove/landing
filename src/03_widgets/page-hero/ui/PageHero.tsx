import { getTranslations } from 'next-intl/server';
import { Container } from '@/shared/ui';

type TStat = {
  value: string;
  label: string;
};

type TProps = {
  namespace: string;
};

export const PageHero = async ({ namespace }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);
  const tCommon = await getTranslations('Common');

  const rawStats = t.has('stats') ? (t.raw('stats') as unknown) : null;
  const stats = Array.isArray(rawStats) ? (rawStats as TStat[]) : [];

  return (
    <header className="relative overflow-hidden px-5 pt-16 pb-10 text-center md:px-6 md:pt-20">
      <div aria-hidden="true" className="page-hero-bg" />
      <Container>
        <div className="mx-auto max-w-190">
          <div className="section-eyebrow !mb-0">{t('crumb')}</div>

          <h1
            className="h-display-page my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink"
          >
            {t('title')}
          </h1>

          <p className="mx-auto max-w-160 text-pretty text-lg text-muted">
            {t('description')}
          </p>

          {stats.length > 0 ? (
            <ul
              className="mx-auto mt-7 grid w-full max-w-2xl list-none grid-cols-3 gap-4 p-0 sm:gap-6"
              aria-label={tCommon('aria.statsGrid')}
            >
              {stats.map((stat) => (
                <li
                  key={stat.label}
                  className="min-w-0 border-l-2 border-primary px-4 text-left sm:px-5"
                >
                  <div className="font-mono text-2xl font-extrabold tracking-[-0.01em] text-primary-ink">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-13 text-muted">{stat.label}</div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </header>
  );
};
