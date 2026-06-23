import type { ComponentPropsWithRef, ElementType } from 'react';

type TProps<T extends ElementType = 'span'> = {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, 'as'>;

export const VisuallyHidden = <T extends ElementType = 'span'>({
  as,
  className = '',
  ...rest
}: TProps<T>) => {
  const Tag = as ?? 'span';
  return <Tag className={`sr-only ${className}`} {...(rest as object)} />;
};
