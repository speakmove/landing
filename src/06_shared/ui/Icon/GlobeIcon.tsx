import type { ComponentPropsWithRef } from 'react';
import { Icon } from './Icon';

type TProps = Omit<ComponentPropsWithRef<typeof Icon>, 'children'>;

/**
 * Simple line globe icon used in the language dropdown.
 */
export const GlobeIcon = (props: TProps) => {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
};
