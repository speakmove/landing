import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

/**
 * Solid play triangle used inside voice-message play buttons.
 * Uses the same fill as the surrounding circle (set via parent `text-X`).
 */
export const PlayIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={0} {...props}>
      <path d="M8 5 L8 19 L20 12 Z" fill="currentColor" stroke="currentColor" />
    </Icon>
  );
};
