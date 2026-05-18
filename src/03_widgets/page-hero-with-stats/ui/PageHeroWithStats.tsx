import { getTranslations } from 'next-intl/server';
import { Container } from '@/shared/ui';

type TStat = {
  value: string;
  label: string;
};

export const PageHeroWithStats = async () => {
  const t = await getTranslations('HowItWorksPage.hero');
  const tCommon = await getTranslations('Common');
  const stats = t.raw('stats') as unknown as TStat[];

  return (
    <header className="relative overflow-hidden px-5 pt-16 pb-10 text-center md:px-6 md:pt-20">
      <div aria-hidden="true" className="page-hero-bg" />
      <Container>
        <div className="mx-auto max-w-190">
          <div className="section-eyebrow !mb-0">{t('crumb')}</div>

          <h1
            className="my-3 font-extrabold leading-[1.08] tracking-tight text-balance text-ink"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)' }}
          >
            {t('title')}
          </h1>

          <p className="mx-auto max-w-160 text-pretty text-lg text-muted">
            {t('description')}
          </p>

          <div
            className="mt-7 flex flex-wrap justify-center gap-8"
            aria-label={tCommon('aria.statsGrid')}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-l-2 border-primary px-5 text-left"
              >
                <div className="font-mono text-2xl font-extrabold tracking-[-0.01em] text-primary-ink">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-[13px] text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
};
