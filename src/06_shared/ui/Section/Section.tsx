import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TTone = 'white' | 'soft';

type TProps = PropsWithChildren<{
  id?: string;
  className?: string;
  ariaLabelledBy?: string;
  tone?: TTone;
}>;

const TONE_CLASS: Record<TTone, string> = {
  white: 'bg-white',
  soft: 'bg-surface',
};

export const Section = ({ id, className, ariaLabelledBy, tone, children }: TProps) => {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn('px-5 py-14 md:px-6 md:py-20', tone ? TONE_CLASS[tone] : undefined, className)}
    >
      {children}
    </section>
  );
};
