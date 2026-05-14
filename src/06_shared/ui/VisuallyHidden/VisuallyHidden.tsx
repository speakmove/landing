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
  return (
    <Tag
      className={`absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 ${className}`}
      style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)' }}
      {...(rest as object)}
    />
  );
};
