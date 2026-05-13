import { getTranslations } from 'next-intl/server';
import { Container } from '@/shared/ui';

type TStat = {
  value: string;
  label: string;
};

export async function PageHeroWithStats() {
  const t = await getTranslations('HowItWorksPage.hero');
  const stats = t.raw('stats') as unknown as TStat[];

  return (
    <header className="relative overflow-hidden pt-16 md:pt-20 pb-10 bg-[color:var(--color-primary-pale)]">
      <Container>
        <div className="text-center max-w-[760px] mx-auto">
          {/* Breadcrumb / kicker chip */}
          <div className="font-mono text-[12.5px] font-semibold text-[color:var(--color-primary)] tracking-[0.08em] uppercase mb-4">
            {t('crumb')}
          </div>

          {/* H1 */}
          <h1 className="font-extrabold tracking-tight leading-[1.08] text-balance text-[color:var(--color-ink)] mb-5"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)' }}
          >
            {t('title')}
          </h1>

          {/* Description */}
          <p className="text-[18px] text-[color:var(--color-muted)] max-w-[640px] mx-auto text-pretty mb-10">
            {t('description')}
          </p>

          {/* Stats grid */}
          <div
            className="flex flex-wrap gap-6 justify-center"
            aria-label="Ключевые показатели"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-left px-5 border-l-2 border-[color:var(--color-primary)]"
              >
                <div className="font-mono font-extrabold text-2xl text-[color:var(--color-primary-ink)] tracking-[-0.01em]">
                  {stat.value}
                </div>
                <div className="text-[13px] text-[color:var(--color-muted)] mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
}
