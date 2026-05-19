import { Coin } from '@/shared/ui';
import type { ComponentProps } from 'react';

type TProps = Omit<ComponentProps<typeof Coin>, 'text'> & {
  text?: string;
};

/**
 * SpeakMove-branded coin — defaults to "SM" lettering.
 * Thin wrapper over the shared generic `Coin` primitive so brand styling
 * lives in one place inside the brand entity.
 */
export const BrandCoin = ({ text = 'SM', ...rest }: TProps) => {
  return <Coin text={text} {...rest} />;
};
