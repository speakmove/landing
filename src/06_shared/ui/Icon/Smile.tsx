import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

/**
 * Smiley face — used as the emoji-tab icon inside Telegram input field.
 */
export const SmileIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={1.6} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 14 Q12 17 16 14" />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1.1" fill="currentColor" stroke="none" />
    </Icon>
  );
};
