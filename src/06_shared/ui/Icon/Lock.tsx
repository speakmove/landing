import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const LockIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  );
};
