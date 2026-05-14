import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
  size?: number;
  label?: string;
};

export function BrandCoin({ className, size = 28, label }: TProps) {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };
  return (
    <span
      {...ariaProps}
      style={{ width: size, height: size }}
      className={cn(
        'grid place-items-center rounded-full bg-linear-to-br from-gold-accent to-gold text-[10px] font-extrabold text-white',
        className,
      )}
    >
      SM
    </span>
  );
}
