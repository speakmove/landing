'use client';
import type { Transition, Variants } from 'framer-motion';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/shared/model/libs/i18n/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { cn } from '@/shared/model/libs/cn';
import { ChevronDownIcon, GlobeIcon } from '@/shared/ui';
import { useDropdown } from '../model/hooks/useDropdown';

type TLocaleCode = (typeof routing.locales)[number];

type TProps = {
  size?: 'md' | 'lg';
};

const LOCALE_LABELS: Record<TLocaleCode, string> = {
  ru: 'Русский',
  uk: 'Українська',
  en: 'English',
};

export const LocaleSwitch = ({ size = 'md' }: TProps = {}) => {
  const current = useLocale() as TLocaleCode;
  const pathname = usePathname();
  const t = useTranslations('HomePage.nav.langToggle');
  const shouldReduceMotion = useReducedMotion();

  const { isOpen, triggerRef, menuRef, close, triggerProps } = useDropdown();

  const isLg = size === 'lg';

  const menuVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.92, y: -4 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.92, y: -4 },
      };

  const menuTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: 'easeOut' };

  const caretTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: 'easeInOut' };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -4 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? ({ duration: 0 } as Transition)
        : ({ duration: 0.14, delay: (i as number) * 0.04, ease: 'easeOut' } as Transition),
    }),
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          isOpen ? t('closeMenu') : `${t('ariaLabel')} — ${t(current)}`
        }
        className={cn(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-surface-warm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          isLg ? 'px-4 py-2.5 text-15' : 'px-3 py-1.5 text-12-5',
        )}
        {...triggerProps}
      >
        <GlobeIcon size={isLg ? 16 : 14} className="text-muted" />
        <span className="font-mono tracking-wide">{t(current)}</span>
        <motion.span
          className="inline-flex text-primary"
          aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={caretTransition}
        >
          <ChevronDownIcon size={isLg ? 14 : 12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="listbox"
            aria-label={t('ariaLabel')}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={menuTransition}
            style={{ transformOrigin: 'top right' }}
            className={cn(
              'absolute right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-line bg-white shadow-md',
              isLg ? 'min-w-40' : 'min-w-36',
            )}
          >
            {routing.locales.map((locale, i) => {
              const isActive = locale === current;
              return (
                <motion.div
                  key={locale}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  role="option"
                  aria-selected={isActive}
                >
                  <Link
                    href={pathname}
                    locale={locale}
                    hrefLang={locale}
                    lang={locale}
                    onClick={close}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-4 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
                      isLg ? 'py-3 text-15' : 'py-2.5 text-14',
                      isActive
                        ? 'bg-primary-pale font-semibold text-primary'
                        : 'text-ink hover:bg-surface',
                    )}
                  >
                    <span className="font-mono text-11 font-bold tracking-wider text-faint">
                      {t(locale)}
                    </span>
                    <span>{LOCALE_LABELS[locale]}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
