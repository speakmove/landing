import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export function CoinIcon(props: TProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </Icon>
  );
}
