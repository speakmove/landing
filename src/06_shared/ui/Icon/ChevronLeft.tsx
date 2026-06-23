import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const ChevronLeftIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={3} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </Icon>
  );
};
