import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

/**
 * "Partial" mark — a tilde/wave glyph, visually distinct from both the
 * solid check (yes) and the flat minus (no). Used in comparison tables
 * to mean "partially / sort of".
 */
export const PartialIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2.5} {...props}>
      <path d="M4 14c1.8-3 3.6-3 5.4 0s3.6 3 5.4 0 3.6-3 5.4 0" />
    </Icon>
  );
};
