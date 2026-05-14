import { getTranslations } from 'next-intl/server';
import { Badge, Card, Container, Section } from '@/shared/ui';

import { WaitlistForm } from '@/features/waitlist-form';

type TPerk = {
  icon: string;
  title: string;
  subtitle: string;
};

const PERK_ICON_MAP: Record<string, string> = {
  gift: '🎁',
  clock: '⏱',
  coin: '🪙',
  flag: '🇺🇦',
  lock: '🔒',
  users: '👨‍👩‍👧',
};

const PerkIcon = ({ name }: { name: string }) => {
  const emoji = PERK_ICON_MAP[name] ?? '✦';
  return (
    <span className="text-2xl" aria-hidden="true">
      {emoji}
    </span>
  );
}

export const WaitlistPage = async () => {
  const t = await getTranslations('WaitlistPage');
  const tCommon = await getTranslations('Common');

  const kicker = t('hero.kicker');
  const title = t('hero.title');
  const description = t('hero.description');
  const bonusBadge = t('hero.bonusBanner.badge');
  const bonusText = t('hero.bonusBanner.text');
  const bonusNote = t('hero.bonusBanner.note');
  const perks = t.raw('hero.perks') as TPerk[];

  const current = t.raw('form.progress.current') as number;
  const total = t.raw('form.progress.total') as number;
  const bonusThreshold = t.raw('form.progress.bonusThreshold') as number;
  const bonusRemaining = Math.max(0, bonusThreshold - current);

  const formTitle = t('form.title');
  const formSubtitle = t('form.subtitle');

  // Template substitutions
  const occupiedText = t('form.progress.occupiedTemplate', { count: current, total });
  const remainingText = t('form.progress.remainingTemplate', { remaining: total - current });
  const bonusRemainingText =
    bonusRemaining > 0
      ? t('form.progress.bonusRemainingTemplate', { bonusRemaining })
      : null;

  return (
    <>
      {/* Hero */}
      <Section className="pb-8 pt-12 md:pb-10 md:pt-16">
        <Container className="max-w-[780px]">
          <div className="text-center">
            <Badge tone="primary">{kicker}</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-relaxed text-muted">
              {description}
            </p>
          </div>

          {/* Bonus banner */}
          <div className="mt-8 rounded-2xl border border-gold bg-gold-pale p-5">
            <div className="flex flex-wrap items-start gap-3">
              <Badge tone="gold">{bonusBadge}</Badge>
              <p className="font-semibold text-ink">{bonusText}</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted italic">
              {bonusNote}
            </p>
          </div>
        </Container>
      </Section>

      {/* Perks grid */}
      <Section className="py-8 md:py-10">
        <Container>
          <ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={tCommon('aria.earlyAccessPerks')}
          >
            {perks.map((perk, i) => (
              <Card key={i} as="li" className="flex flex-col gap-2 p-5">
                <PerkIcon name={perk.icon} />
                <p className="font-semibold text-ink">{perk.title}</p>
                <p className="text-sm text-muted leading-relaxed">
                  {perk.subtitle}
                </p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Form section */}
      <Section id="waitlist-form">
        <Container className="max-w-160">
          {/* Progress bar */}
          <div className="mb-8 rounded-2xl border border-line bg-white p-5 shadow-(--shadow-soft)">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-ink">{occupiedText}</span>
              <span className="text-muted">{remainingText}</span>
            </div>
            <div
              className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-label={occupiedText}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (current / total) * 100)}%` }}
              />
            </div>
            {bonusRemainingText ? (
              <p className="mt-2 text-xs text-muted">{bonusRemainingText}</p>
            ) : null}
          </div>

          {/* Form card */}
          <Card className="p-6 sm:p-8">
            <h2
              id="waitlist-form-title"
              className="text-2xl font-extrabold tracking-tight text-ink"
            >
              {formTitle}
            </h2>
            <p className="mt-2 text-sm text-muted">{formSubtitle}</p>
            <div className="mt-6">
              <WaitlistForm />
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
