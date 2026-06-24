'use client';

import { useScenariosWheel } from '../model/hooks/useScenariosWheel';
import { ScenarioRow } from './ScenarioRow';
import { ScenarioRowStatic } from './ScenarioRowStatic';
import type { TScenarioRowProps } from '../model/types';

type TProps = {
  rows: TScenarioRowProps[];
  ariaLabel: string;
};

/**
 * Client island that renders the iOS-wheel scroll picker.
 *
 * Thin presentational component: all orchestration (MotionValues, ResizeObserver,
 * scroll settle-listener, activeIndex, renderRows) lives in `useScenariosWheel`.
 *
 * ## Reduced-motion — flat list
 * Plain `<ul>`, every row fully visible, no wheel mechanics.
 * Uses `ScenarioRowStatic` which has zero client-side hooks.
 *
 * ## Wheel variant
 * `data-lenis-prevent` keeps the wheel scrollable under Lenis on desktop;
 * on mobile Lenis is off so the attribute is harmless.
 */
export function ScenariosWheel({ rows, ariaLabel }: TProps) {
  const {
    containerRef,
    shouldReduce,
    scrollY,
    rowHeight,
    activeIndex,
    renderRows,
    centerOffset,
  } = useScenariosWheel(rows);

  // ── Reduced-motion: flat static list ─────────────────────────────────────
  if (shouldReduce) {
    return (
      <ul className="m-0 list-none p-0" aria-label={ariaLabel}>
        {rows.map((row) => (
          <ScenarioRowStatic key={row.href} {...row} />
        ))}
      </ul>
    );
  }

  // ── Wheel variant ─────────────────────────────────────────────────────────
  return (
    <div className="scenarios-wheel-outer">
      <div
        ref={containerRef}
        className="scenarios-wheel-scroll"
        role="listbox"
        aria-label={ariaLabel}
        data-lenis-prevent
      >
        <ul className="m-0 list-none p-0">
          {renderRows.map((row, index) => (
            <ScenarioRow
              key={`${row.href}-${index}`}
              {...row}
              scrollY={scrollY}
              rowHeight={rowHeight}
              index={index}
              centerOffset={centerOffset}
              isActive={index === activeIndex}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
