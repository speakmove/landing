import { getTranslations } from 'next-intl/server';
import { ButtonLink, Container, CheckIcon, ArrowRightIcon } from '@/shared/ui';
import { ScenarioCard } from '@/entities/scenario';
import { HomePhonePreview } from '@/widgets/home-phone-preview';
import { PATHS, ANCHORS } from '@/shared/config';

import type { TScenario } from '@/entities/scenario';

export const HomeHero = async () => {
  const t = await getTranslations('HomePage.hero');

  const eyebrowItems = t.raw('eyebrow.items') as unknown as string[];
  const metaPoints = t.raw('metaPoints') as unknown as string[];
  const scenarios = t.raw('scenarioPicker.cards') as unknown as TScenario[];

  return (
    <header id={ANCHORS.hero} className="relative overflow-hidden px-5 py-14 md:px-6 md:py-20 lg:pb-24">
      <div aria-hidden="true" className="hero-bg-grid" />

      <Container className="px-0">
        <div className="mt-4 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Left column */}
          <div>
            {/* Eyebrow chip */}
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/85 px-3.5 py-1.5 text-[10px] font-semibold text-muted shadow-(--shadow-soft) md:text-[13px]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_20%,transparent)]" />
              {eyebrowItems.map((item, idx) => (
                <span key={item} className="inline-flex items-center gap-2.5">
                  {idx > 0 ? <span className="text-line-strong">·</span> : null}
                  {item}
                </span>
              ))}
            </span>

            {/* H1 */}
            <h1
              className="mt-4 mb-5 font-extrabold leading-[1.03] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4.1rem)' }}
            >
              {t('title.before')}
              <span className="accent-underline">{t('title.accent')}</span>
              {t('title.after')}
            </h1>

            {/* Description */}
            <p className="mb-7 max-w-140 text-lg leading-[1.55] text-muted">
              {t('description')}
            </p>

            {/* CTAs */}
            <div className="mb-8 flex flex-wrap gap-3">
              <ButtonLink href={PATHS.waitlist} variant="primary" size="lg">
                {t('ctas.primary')}
                <ArrowRightIcon size={16} />
              </ButtonLink>
              <ButtonLink href={`/#${ANCHORS.howItWorks}`} variant="outline" size="lg">
                {t('ctas.secondary')}
              </ButtonLink>
            </div>

            {/* Meta points */}
            <div className="flex flex-wrap gap-5 text-[13.5px] text-muted">
              {metaPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5 font-medium">
                  <CheckIcon size={14} className="text-primary shrink-0" strokeWidth={3} />
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
          <div className="relative flex justify-center lg:justify-end">
            <HomePhonePreview />
          </div>
        </div>
      </Container>
    </header>
  );
};
