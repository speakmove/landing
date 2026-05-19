import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'svg'> & {
  label?: string;
};

/**
 * SpeakMove horizontal lockup (mark + wordmark).
 * Uses brand colours #0E6E3B (mark + accent) and #0D1A12 (wordmark base).
 * The wordmark relies on Inter being available — the project already loads it.
 */
export const LogoHorizontal = ({ ref, className, label, ...rest }: TProps) => {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: false as const };

  return (
    <svg
      ref={ref}
      viewBox="0 0 220 56"
      width="140"
      height="32"
      className={cn('inline-block shrink-0', className)}
      preserveAspectRatio="xMinYMid meet"
      {...ariaProps}
      {...rest}
    >
      {label ? <title>{label}</title> : null}
      <g transform="translate(4 4)">
        <circle cx="24" cy="24" r="24" fill="#0E6E3B" />
        <g transform="scale(1.5)" fill="#FFFFFF">
          <rect x="6.25" y="14" width="2" height="4" rx="1" opacity="0.55" />
          <rect x="9.75" y="11" width="2" height="10" rx="1" opacity="0.82" />
          <rect x="13.25" y="6.5" width="2" height="19" rx="1" />
          <rect x="16.75" y="9" width="2" height="14" rx="1" opacity="0.92" />
          <rect x="20.25" y="12" width="2" height="8" rx="1" opacity="0.78" />
          <rect x="23.75" y="13.5" width="2" height="5" rx="1" opacity="0.55" />
        </g>
      </g>
      <text
        x="62"
        y="38"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="-0.5"
        fill="#0D1A12"
      >
        Speak
        <tspan fill="#0E6E3B">Move</tspan>
      </text>
    </svg>
  );
};
