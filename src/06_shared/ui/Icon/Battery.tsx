import type { CSSProperties } from 'react';
import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'> & {
  /** 0..100 percent filled */
  level?: number;
};

/**
 * iOS-style battery icon. `level` (0..100) controls inner fill width.
 * Width is set via a CSS custom property to avoid inline style on the SVG element.
 */
export const BatteryIcon = ({ level = 100, ...rest }: TProps) => {
  const clamped = Math.max(0, Math.min(100, level));
  const fillWidth = (clamped / 100) * 14; // inner area width 14
  return (
    <Icon strokeWidth={1.2} {...rest}>
      <rect x="2" y="8" width="18" height="10" rx="2" />
      <rect x="20.5" y="11" width="1.5" height="4" rx="0.5" fill="currentColor" />
      <rect
        x="3"
        y="9"
        width={fillWidth}
        height="8"
        rx="1"
        fill="currentColor"
        style={{ '--bat': clamped } as CSSProperties}
      />
    </Icon>
  );
};
