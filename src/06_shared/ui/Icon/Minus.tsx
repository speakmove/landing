import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const MinusIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2.5} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
};
