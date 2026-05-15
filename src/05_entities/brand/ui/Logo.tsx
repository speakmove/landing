import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  className?: string;
};

export const Logo = async ({ className }: TProps) => {
  const t = await getTranslations('HomePage.nav');
  return (
    <span className={cn('inline-flex items-center', className)}>
      <Image
        src="/brand/speakmove-logo-horizontal.svg"
        alt={t('brand')}
        width={134}
        height={32}
        priority
        unoptimized
      />
    </span>
  );
};
