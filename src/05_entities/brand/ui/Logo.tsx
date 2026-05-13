import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
};

export async function Logo({ className }: TProps) {
  const t = await getTranslations('HomePage.nav');
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight', className)}>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-gold-accent)] to-[color:var(--color-gold)] text-[11px] font-extrabold text-white"
      >
        {t('brandCoinLabel')}
      </span>
      <span>{t('brand')}</span>
    </span>
  );
}
