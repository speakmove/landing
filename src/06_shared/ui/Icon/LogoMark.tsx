import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'svg'> & {
  label?: string;
  size?: number;
};

/**
 * SpeakMove primary logo mark (1:1 green circle + white voice envelope).
 * Brand colour #0E6E3B.
 */
export const LogoMark = ({ ref, className, label, size = 32, ...rest }: TProps) => {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: false as const };

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn('inline-block shrink-0', className)}
      {...ariaProps}
      {...rest}
    >
      {label ? <title>{label}</title> : null}
      <circle cx="16" cy="16" r="16" fill="#0E6E3B" />
      <g fill="#FFFFFF">
        <rect x="6.25" y="14" width="2" height="4" rx="1" opacity="0.55" />
        <rect x="9.75" y="11" width="2" height="10" rx="1" opacity="0.82" />
        <rect x="13.25" y="6.5" width="2" height="19" rx="1" />
        <rect x="16.75" y="9" width="2" height="14" rx="1" opacity="0.92" />
        <rect x="20.25" y="12" width="2" height="8" rx="1" opacity="0.78" />
        <rect x="23.75" y="13.5" width="2" height="5" rx="1" opacity="0.55" />
      </g>
    </svg>
  );
};
