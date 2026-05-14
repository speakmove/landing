import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'label'> & {
  htmlFor: string;
};

export const Label = ({ ref, htmlFor, className, children, ...rest }: TProps) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-ink', className)}
      {...rest}
    >
      {children}
    </label>
  );
};
