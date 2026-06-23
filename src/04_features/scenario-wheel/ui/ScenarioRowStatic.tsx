import { ScenarioRowContent } from './ScenarioRowContent';
import type { TScenarioRowProps } from '../model/types';

/**
 * Static (reduced-motion) variant of a scenario row.
 *
 * No scroll mechanics, no MotionValues, no hooks beyond what React itself
 * needs. All rows are fully visible (opacity 1, no tilt, no scale).
 * The number is always in the default muted colour (isActive: false).
 *
 * Used by ScenariosWheel when `useReducedMotion()` is true.
 * Not a 'use client' component — no client-side APIs are used.
 */
export function ScenarioRowStatic({
  number,
  title,
  aiRole,
  hook,
  duration,
  href,
  ariaLabel,
}: TScenarioRowProps) {
  return (
    <li className="list-none">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="group flex w-full flex-col gap-2 border-b border-line py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:flex-row sm:items-start sm:gap-6 sm:py-7 md:py-8"
      >
        <ScenarioRowContent
          number={number}
          title={title}
          aiRole={aiRole}
          hook={hook}
          duration={duration}
          isActive={false}
        />
      </a>
    </li>
  );
}
