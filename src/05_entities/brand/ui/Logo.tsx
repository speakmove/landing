import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
};

export const Logo = async ({ className }: TProps) => {
  const t = await getTranslations('HomePage.nav');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-ink',
        className,
      )}
    >
      <span aria-hidden="true" className="brand-coin">
        {t('brandCoinLabel')}
      </span>
      <span>{t('brand')}</span>
    </span>
  );
};
