import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

/**
 * Two stacked check marks — Telegram "message delivered+read" indicator.
 * Width:height ratio 14:9 so it sits next to a 11px timestamp.
 */
export const DoubleCheckIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={1.6} viewBox="0 0 15 11" {...props}>
      <path d="M1 5.5 L4 8.5 L9 2" />
      <path d="M8 8.5 L13 2" />
    </Icon>
  );
};
