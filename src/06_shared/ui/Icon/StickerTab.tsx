import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

/**
 * Telegram-style sticker-tab silhouette — circle with a folded corner.
 * Replaces the smile icon inside the text field when the keyboard is closed.
 */
export const StickerTabIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={1.6} {...props}>
      <path d="M3 12a9 9 0 1 0 9-9v5a4 4 0 0 0 4 4z" />
    </Icon>
  );
};
