import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export function CheckIcon(props: TProps) {
  return (
    <Icon strokeWidth={3} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}
