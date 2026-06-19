import { ArrowRightIcon } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import type { TScenarioRowProps } from '../model/types';

type TProps = Pick<TScenarioRowProps, 'number' | 'title' | 'aiRole' | 'hook' | 'duration'> & {
  /**
   * When true, the row is the active/centred one: number is primary (green)
   * and the CTA arrow is shown (so touch devices, which have no hover, still
   * see the affordance on the selected row).
   */
  isActive: boolean;
};

/**
 * Shared presentational inner content for a scenario row.
 *
 * Renders: mono number, title + duration row, AI role, hook line, CTA arrow.
 * All texts are single-line (truncated) so every row is the same height.
 * The hook (description) is visible on every row — dimmed rows simply inherit
 * the row's reduced opacity. No scroll logic; all decisions come in as props.
 *
 * Both `ScenarioRow` (wheel) and `ScenarioRowStatic` (reduced-motion) use this.
 */
export function ScenarioRowContent({
  number,
  title,
  aiRole,
  hook,
  duration,
  isActive,
}: TProps) {
  return (
    <>
      {/* Mono row number — primary (green) when active, muted otherwise */}
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 font-mono text-3xl font-bold leading-none tracking-tighter transition-colors sm:text-4xl',
          isActive ? 'text-primary' : 'text-line-strong',
        )}
      >
        {number}
      </span>

      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Title + duration row */}
        <div className="flex items-baseline gap-x-3">
          <h3 className="m-0 min-w-0 truncate text-lg font-bold tracking-tight text-ink sm:text-xl">
            {title}
          </h3>
          <span className="shrink-0 font-mono text-12 font-semibold text-muted sm:text-13">
            {duration}
          </span>
        </div>

        {/* AI role */}
        <p className="m-0 truncate text-13 font-semibold text-primary sm:text-15">{aiRole}</p>

        {/* Hook / description — single line, visible on every row */}
        <p className="m-0 mt-0.5 truncate text-13 leading-relaxed text-muted sm:text-15">{hook}</p>
      </div>

      {/* CTA arrow — shown on the active row (touch has no hover) and on hover/focus */}
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 self-center text-primary transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:self-start sm:pt-1',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      >
        <ArrowRightIcon size={20} />
      </span>
    </>
  );
}
