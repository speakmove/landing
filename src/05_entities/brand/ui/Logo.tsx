import { getTranslations } from 'next-intl/server';
import { LogoHorizontal } from '@/shared/ui';

type TProps = {
  className?: string;
};

export const Logo = async ({ className }: TProps) => {
  const t = await getTranslations('HomePage.nav');
  return <LogoHorizontal className={className} label={t('brand')} />;
};
