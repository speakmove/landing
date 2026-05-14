'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/shared/model/libs/i18n/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { cn } from '@/shared/model/libs/cn';

export const LocaleSwitch = () => {
  const current = useLocale();
  const pathname = usePathname();
  const t = useTranslations('HomePage.nav.langToggle');

  return (
    <nav aria-label={t('ariaLabel')} className="lang-toggle" role="tablist">
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
            className={cn(isActive && 'is-active', !isActive && 'hover:text-ink')}
          >
            {t(locale)}
          </Link>
        );
      })}
    </nav>
  );
};
