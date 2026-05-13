import { getTranslations } from 'next-intl/server';
import { Container, Section, CheckIcon, ArrowRightIcon } from '@/shared/ui';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { ScenarioCard } from '@/entities/scenario';
import { HomePhonePreview } from '@/widgets/home-phone-preview';
import type { TScenario } from '@/entities/scenario';

export async function HomeHero() {
  const t = await getTranslations('HomePage.hero');

  const eyebrowItems = t.raw('eyebrow.items') as unknown as string[];
  const metaPoints = t.raw('metaPoints') as unknown as string[];
  const scenarios = t.raw('scenarioPicker.cards') as unknown as TScenario[];

  return (
    <Section
      id="hero"
      className="relative overflow-hidden py-14 md:py-20 lg:pb-24 bg-[color:var(--color-surface)]"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-ink) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, var(--color-ink) 0 1px, transparent 1px 48px)',
        }}
        aria-hidden="true"
      />

      <Container>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 items-center">
          {/* Left column */}
          <div>
            {/* Eyebrow chip */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold text-[color:var(--color-muted)] shadow-[var(--shadow-soft)] md:text-[13px]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-primary)]"
                style={{
                  boxShadow: '0 0 0 4px color-mix(in oklab, var(--color-primary) 20%, transparent)',
                }}
              />
              {eyebrowItems.join(' · ')}
            </span>

            {/* H1 */}
            <h1
              className="mt-4 mb-5 font-extrabold leading-[1.03] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4.1rem)' }}
            >
              {t('title.before')}
              <span className="relative text-[color:var(--color-primary)]">
                {t('title.accent')}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[color:var(--color-primary)] opacity-30"
                  aria-hidden="true"
                />
              </span>
              {t('title.after')}
            </h1>

            {/* Description */}
            <p className="mb-7 max-w-[560px] text-[17px] leading-[1.55] text-[color:var(--color-muted)]">
              {t('description')}
            </p>

            {/* CTAs */}
            <div className="mb-8 flex flex-wrap gap-3">
              <a
                href="#cta"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-6 text-base font-semibold text-white transition-colors hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
              >
                {t('ctas.primary')}
                <ArrowRightIcon size={16} />
              </a>
              <Link
                href="/#how-it-works"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-xl border border-[color:var(--color-line-strong)] bg-white px-6 text-base font-semibold text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
              >
                {t('ctas.secondary')}
              </Link>
            </div>

            {/* Meta points */}
            <div className="flex flex-wrap gap-4 text-[13.5px] text-[color:var(--color-muted)]">
              {metaPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5 font-medium">
                  <CheckIcon
                    size={14}
                    className="text-[color:var(--color-primary)] shrink-0"
                  />
                  {point}
                </span>
              ))}
            </div>

            {/* Scenario picker */}
            <div
              className="mt-8 grid gap-3 sm:grid-cols-2"
              role="group"
              aria-label={t('scenarioPicker.ariaLabel')}
            >
              {scenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </div>
          </div>

          {/* Right column — phone preview */}
          <div className="flex justify-center lg:justify-end">
            <HomePhonePreview />
          </div>
        </div>
      </Container>
    </Section>
  );
}
