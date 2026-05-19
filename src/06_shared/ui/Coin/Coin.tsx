import { cn } from '@/shared/model/libs/cn';

type TSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

type TProps = {
  className?: string;
  label?: string;
  text?: string;
  size?: TSize;
};

const SIZE_CLASS: Record<TSize, string> = {
  sm: 'coin sm',
  md: 'coin md',
  lg: 'coin lg',
  xl: 'coin xl',
  '2xl': 'coin coin-2xl',
  '3xl': 'coin coin-3xl',
  '4xl': 'coin coin-4xl',
};

/**
 * Generic gold "coin" decorative element (rounded disc with letters).
 * Brand-agnostic — pass `text` to set the inner label. Sized via CSS variable
 * tokens (`.coin.sm` ... `.coin-4xl`) defined in globals.css.
 */
export const Coin = ({ className, label, text = 'SM', size }: TProps) => {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };
  return (
    <span {...ariaProps} className={cn(size ? SIZE_CLASS[size] : 'brand-coin', className)}>
      <span>{text}</span>
    </span>
  );
};
