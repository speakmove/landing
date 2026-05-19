import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const ChevronDownIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2.5} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Icon>
  );
};
