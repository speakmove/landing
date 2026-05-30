import type { ComponentPropsWithRef } from 'react';

type TProps = Omit<ComponentPropsWithRef<'svg'>, 'fill'> & {
  fill?: string;
};

/**
 * Decorative wave cap used between full-bleed sections.
 * Stretches horizontally via preserveAspectRatio="none".
 */
export const WaveDivider = ({ fill = 'currentColor', className, ...rest }: TProps) => {
  return (
    <svg
      viewBox="0 0 600 52"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
      className={className}
      {...rest}
    >
      <path d="M0,0 H600 V30 C440,-16 160,66 0,14 Z" fill={fill} />
    </svg>
  );
};
