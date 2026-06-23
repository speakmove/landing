import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/model/libs/cn';

type TProps = ComponentPropsWithRef<'svg'> & {
  side: 'left' | 'right';
  /** Fill color of the bubble body that the tail extends from. */
  fill: string;
};

/**
 * Speech-bubble tail used inside chat bubbles.
 * `side="right"` curves from bottom-right (for outgoing/me bubbles),
 * `side="left"` curves from bottom-left (for incoming/bot bubbles).
 */
export const BubbleTail = ({ ref, side, fill, className, ...rest }: TProps) => {
  return (
    <svg
      ref={ref}
      width="12"
      height="13"
      viewBox="0 0 12 13"
      className={cn('pointer-events-none', className)}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {side === 'right' ? (
        <path d="M0 0 L0 13 L11 13 Q5 6 0 0 Z" fill={fill} />
      ) : (
        <path d="M12 0 L12 13 L1 13 Q7 6 12 0 Z" fill={fill} />
      )}
    </svg>
  );
};
