import { getTranslations } from 'next-intl/server';
import { CheckIcon, ClockIcon, GiftIcon } from '@/shared/ui';
import { WaitlistForm } from '@/features/waitlist-form';

type TPerk = {
  icon: string;
  title: string;
  subtitle: string;
};

const renderPerkIcon = (name: string) => {
  const base = 'grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border border-line bg-white text-primary shadow-(--shadow-soft)';
  if (name === 'clock' || name === 'gift') {
    return (
      <div className={base} aria-hidden="true">
        {name === 'clock' ? <ClockIcon size={17} /> : <GiftIcon size={17} />}
      </div>
    );
  }
  if (name === 'coin') {
    return (
      <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border border-line bg-white shadow-(--shadow-soft)">
        <span className="coin md" aria-hidden="true">
          <span>SM</span>
        </span>
      </div>
    );
  }
  return (
    <div className={base} aria-hidden="true">
      <CheckIcon size={17} strokeWidth={2.5} />
    </div>
  );
};

export const WaitlistPage = async () => {
  const t = await getTranslations('WaitlistPage');

  const kicker = t('hero.kicker');
  const title = t('hero.title');
  const description = t('hero.description');
  const bonusBadge = t('hero.bonusBanner.badge');
  const bonusText = t('hero.bonusBanner.text');
  const bonusNote = t('hero.bonusBanner.note');
  const perks = t.raw('hero.perks') as TPerk[];

  const current = t.raw('form.progress.current') as number;
  const total = t.raw('form.progress.total') as number;
  const occupiedText = t('form.progress.occupiedTemplate', { count: current, total });
  const remainingText = t('form.progress.remainingTemplate', { remaining: total - current });
  // 1 decimal place, clamped to [0, 100]
  const pct = Math.min(100, Math.max(0, Number(((current / total) * 100).toFixed(1))));

  const formTitle = t('form.title');
  const formSubtitle = t('form.subtitle');

  return (
    <main className="mx-auto grid w-full max-w-300 grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center border-b border-line bg-surface px-7 py-12 lg:border-r lg:border-b-0 lg:px-14 lg:py-16">
        <div className="section-eyebrow !mb-4">{kicker}</div>

        <h1
          className="mb-4 font-extrabold leading-[1.1] tracking-tight text-balance text-ink"
          style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)' }}
        >
          {title}
        </h1>
        <p className="mb-7 max-w-110 text-pretty text-base leading-[1.65] text-muted">
          {description}
        </p>

        <div className="mb-9 rounded-2xl border border-gold bg-gold-pale p-5">
          <div className="flex flex-wrap items-start gap-3">
            <span className="inline-flex items-center rounded-full bg-gold-accent px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#4a2e07]">
              {bonusBadge}
            </span>
            <p className="m-0 text-sm font-semibold text-ink">{bonusText}</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed italic text-muted">{bonusNote}</p>
        </div>

        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {perks.map((perk, i) => (
            <li key={`${perk.title}-${i}`} className="flex items-start gap-3 text-[15px]">
              {renderPerkIcon(perk.icon)}
              <div>
                <div className="mb-0.5 font-semibold text-ink">{perk.title}</div>
                <div className="text-[13px] text-muted">{perk.subtitle}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center px-7 py-12 lg:px-14 lg:py-16">
        <div className="mb-7">
          <div className="mb-1.5 flex justify-between font-mono text-xs font-semibold text-muted">
            <span>{occupiedText}</span>
            <span className="text-ink">{remainingText}</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={current}
            aria-label={occupiedText}
            className="h-2 overflow-hidden rounded-full bg-surface"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-primary-hover transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mb-1.5 text-[22px] font-extrabold tracking-tight text-ink">
          {formTitle}
        </div>
        <div className="mb-7 text-[14.5px] text-muted">{formSubtitle}</div>

        <WaitlistForm />
      </div>
    </main>
  );
};
