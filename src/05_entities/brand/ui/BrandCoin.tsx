import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
  label?: string;
  text?: string;
};

export const BrandCoin = ({ className, label, text = 'SM' }: TProps) => {
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };
  return (
    <span {...ariaProps} className={cn('brand-coin', className)}>
      {text}
    </span>
  );
};
