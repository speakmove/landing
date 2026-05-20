'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/shared/model/libs/i18n/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  size?: 'md' | 'lg';
};

export const LocaleSwitch = ({ size = 'md' }: TProps = {}) => {
  const current = useLocale();
  const pathname = usePathname();
  const t = useTranslations('HomePage.nav.langToggle');

  const isLg = size === 'lg';

  return (
    <nav
      aria-label={t('ariaLabel')}
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-full bg-surface-warm font-semibold text-muted',
        isLg ? 'gap-1 p-1.5 text-15' : 'gap-0.5 p-1 text-12-5',
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === current;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-full text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isLg ? 'min-w-14 px-5 py-2.5' : 'px-2.5 py-1',
              isActive ? 'bg-white text-ink shadow-sm' : 'hover:text-ink',
            )}
          >
            {t(locale)}
          </Link>
        );
      })}
    </nav>
  );
};
