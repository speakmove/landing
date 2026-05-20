import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const MailIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 6.5l9 7 9-7" />
    </Icon>
  );
};
