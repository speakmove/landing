'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/shared/model/libs/i18n/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { cn } from '@/shared/model/libs/cn';

export function LocaleSwitch() {
  const current = useLocale();
  const pathname = usePathname();
  const t = useTranslations('HomePage.nav.langToggle');

  return (
    <nav aria-label={t('ariaLabel')}>
      <ul className="flex items-center gap-0.5 rounded-full border border-line bg-white p-0.5 text-xs font-semibold">
        {routing.locales.map((locale) => {
          const isActive = locale === current;
          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                hrefLang={locale}
                lang={locale}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-7 items-center rounded-full px-2.5 transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-ink',
                )}
              >
                {t(locale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
