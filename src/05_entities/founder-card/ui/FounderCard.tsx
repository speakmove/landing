import { ArrowRightIcon } from '@/shared/ui';
import { safeHrefOrFallback } from '@/shared/model/utils';
import type { TFounder } from '../model/types';

type TProps = {
  founder: TFounder;
  /** Localized "Write in Telegram" label, prepended to the handle. */
  ctaLabel: string;
};

/**
 * Founder mini-story card for the light brand founders section.
 * White surface with a soft shadow; avatar circle + Telegram link use
 * the brand primary green for accent.
 */
export const FounderCard = ({ founder, ctaLabel }: TProps) => {
  return (
    <article className="flex h-full flex-col rounded-card-lg border border-line bg-white p-6 shadow-(--shadow-soft) md:p-8">
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary font-mono text-2xl font-extrabold text-white"
        >
          {founder.initials}
        </span>
        <div className="min-w-0">
          <p className="m-0 text-lg font-bold text-ink">{founder.name}</p>
          <p className="m-0 mt-0.5 text-13 text-muted">{founder.role}</p>
        </div>
      </header>

      <p className="m-0 mt-5 flex-1 text-15 leading-relaxed text-muted">
        {founder.story}
      </p>

      <a
        href={safeHrefOrFallback(founder.telegramUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-[gap] hover:gap-2 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {ctaLabel} {founder.telegramHandle}
        <ArrowRightIcon size={14} />
      </a>
    </article>
  );
};
