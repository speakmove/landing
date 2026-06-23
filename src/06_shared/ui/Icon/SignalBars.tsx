import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

/**
 * iOS-style cell signal — 4 vertical bars of increasing height.
 * Filled bars (no stroke). Use `text-X` on parent to recolor.
 */
export const SignalBarsIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={0} {...props}>
      <rect x="2" y="14" width="3" height="6" rx="0.5" fill="currentColor" />
      <rect x="7" y="11" width="3" height="9" rx="0.5" fill="currentColor" />
      <rect x="12" y="7" width="3" height="13" rx="0.5" fill="currentColor" />
      <rect x="17" y="3" width="3" height="17" rx="0.5" fill="currentColor" opacity="0.4" />
    </Icon>
  );
};
