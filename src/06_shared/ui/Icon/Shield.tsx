import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const ShieldIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Icon>
  );
};
