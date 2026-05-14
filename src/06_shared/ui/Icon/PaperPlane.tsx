import type { ComponentProps } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentProps<typeof Icon>, 'children'>;

export const PaperPlaneIcon = (props: TProps) => {
  return (
    <Icon strokeWidth={2} {...props}>
      <path d="M22 2 2 9l9 4 4 9 7-20Z" />
    </Icon>
  );
};
