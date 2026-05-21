import type { ReactNode } from 'react';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { ArrowRightIcon, CheckIcon } from '@/shared/ui';
import { isExternalHref, isSafeHref } from '@/shared/model/utils';
import { cn } from '@/shared/model/libs/cn';
import type { TPricingCardData, TPricingCardVariant } from '../model/types';

type TProps = TPricingCardData & TPricingCardVariant & {
  /** id for aria-labelledby on the wrapping section/article. */
  titleId?: string;
};

/**
 * Single-plan pricing card. Used in two places:
 *  - /pricing as the main plan card (`size="compact"`, narrow, no subtitle,
 *    optional `subprice`).
 *  - home page as a slim teaser (`size="wide"`, two-column feature grid,
 *    subtitle + secondary "see details" link to /pricing).
 *
 * Both surfaces share the badge → big per-day price → equality → features
 * → CTA → footnote rhythm; props drive the cosmetic differences.
 */
export const PricingCard = ({
  badge,
  title,
  subtitle,
  perDay,
  perDayUnit,
  perMonth,
  subprice,
  features,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryLink,
  footnote,
  size = 'compact',
  titleId,
}: TProps) => {
  const isWide = size === 'wide';

  return (
    <article
      className={cn(
        'mx-auto flex flex-col rounded-card-lg border border-line bg-white p-7 shadow-(--shadow-soft) md:p-10',
        isWide ? 'max-w-2xl items-center text-center' : 'max-w-md',
      )}
      aria-labelledby={titleId}
    >
      <header className={isWide ? '' : 'text-center'}>
        <span className="inline-flex items-center rounded-full bg-primary-pale px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary-ink">
          {badge}
        </span>
        <h2
          id={titleId}
          className={cn(
            'mt-3 font-extrabold tracking-tight text-ink',
            isWide ? 'text-balance text-3xl md:text-4xl' : 'text-2xl',
          )}
        >
          {title}
        </h2>

        <div className="mt-6 flex items-baseline justify-center gap-2">
          <span
            className={cn(
              'font-extrabold tracking-tight text-primary-ink',
              isWide ? 'text-5xl md:text-6xl' : 'text-6xl',
            )}
          >
            {perDay}
          </span>
          <span
            className={cn(
              'font-semibold text-muted',
              isWide ? 'text-base md:text-lg' : 'text-lg',
            )}
          >
            {perDayUnit}
          </span>
        </div>
        <p className="mt-1.5 m-0 font-mono text-13-5 text-muted">{perMonth}</p>

        {subprice ? <p className="mt-2 m-0 text-13 text-faint">{subprice}</p> : null}
        {subtitle ? (
          <p className="mt-4 m-0 max-w-lg text-pretty text-15-5 leading-relaxed text-muted">
            {subtitle}
          </p>
        ) : null}
      </header>

      <ul
        className={cn(
          'mt-7 m-0 list-none p-0',
          isWide ? 'grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2' : 'space-y-3',
        )}
      >
        {features.map((feature, idx) => (
          <li
            key={`${idx}-${feature.slice(0, 24)}`}
            className={cn(
              'flex items-start gap-2.5 leading-snug text-ink',
              isWide ? 'text-14-5' : 'text-15-5',
            )}
          >
            <CheckIcon
              size={isWide ? 16 : 18}
              strokeWidth={3}
              className="mt-0.5 shrink-0 text-primary"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          'mt-7 flex flex-col items-center gap-3',
          isWide ? 'sm:flex-row' : 'w-full',
        )}
      >
        <PrimaryCta href={primaryCtaHref} fullWidth={!isWide}>
          {primaryCtaLabel}
        </PrimaryCta>
        {secondaryLink ? <SecondaryLink {...secondaryLink} /> : null}
      </div>

      <p
        className={cn(
          'mt-5 m-0 text-12-5 text-muted',
          isWide ? '' : 'text-center',
        )}
      >
        {footnote}
      </p>
    </article>
  );
};

const PrimaryCta = ({
  href,
  fullWidth,
  children,
}: {
  href: string;
  fullWidth: boolean;
  children: ReactNode;
}) => {
  if (!isSafeHref(href)) return null;
  const className = cn('btn btn-primary btn-lg', fullWidth && 'w-full');
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const SecondaryLink = ({ href, label }: { href: string; label: string }) => {
  if (!isSafeHref(href)) return null;
  const className =
    'inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5 transition-[gap] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ArrowRightIcon size={14} />
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
      <ArrowRightIcon size={14} />
    </Link>
  );
};
