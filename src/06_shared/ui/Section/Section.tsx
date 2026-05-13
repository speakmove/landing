import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = PropsWithChildren<{
  id?: string;
  className?: string;
  ariaLabelledBy?: string;
}>;

export function Section({ id, className, ariaLabelledBy, children }: TProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn('py-14 md:py-20', className)}
    >
      {children}
    </section>
  );
}
