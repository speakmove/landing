'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/shared/model/libs/i18n/navigation';
import {
  ArrowRightIcon,
  BurgerIcon,
  ButtonLink,
  CloseIcon,
  LogoHorizontal,
  Portal,
} from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { ANCHORS, PATHS, URLS } from '@/shared/config';
import { useMobileMenuState } from '../model/hooks/useMobileMenuState';

type TLinkKey = 'howItWorks' | 'advantages' | 'pricing';
type TNavItem = { key: TLinkKey; href: string };

const NAV_ITEMS: TNavItem[] = [
  { key: 'howItWorks', href: PATHS.howItWorks },
  { key: 'advantages', href: `/#${ANCHORS.advantages}` },
  { key: 'pricing', href: PATHS.pricing },
];

export const HeaderMobileMenu = () => {
  const t = useTranslations('HomePage.nav');
  const tLinks = useTranslations('HomePage.nav.links');
  const tCommon = useTranslations('Common');
  const { open, openMenu, close, buttonRef, firstLinkRef } = useMobileMenuState();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={tCommon('aria.openMenu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={openMenu}
        className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
      >
        <BurgerIcon size={22} />
      </button>

      {open ? (
        <Portal>
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={tCommon('aria.menu')}
            className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <LogoHorizontal label={t('brand')} />
              <button
                type="button"
                aria-label={tCommon('aria.closeMenu')}
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <CloseIcon size={22} />
              </button>
            </div>

            <nav aria-label={tCommon('aria.primary')} className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {NAV_ITEMS.map((item, idx) => (
                  <li key={item.key}>
                    <Link
                      ref={idx === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={close}
                      className="block rounded-xl px-4 py-3 text-lg font-semibold text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {tLinks(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <LocaleSwitch />
              </div>
            </nav>

            <div className="border-t border-line p-5">
              <ButtonLink
                href={URLS.telegramBot}
                onClick={close}
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                {t('cta')}
                <ArrowRightIcon size={14} />
              </ButtonLink>
            </div>
          </div>
        </Portal>
      ) : null}
    </>
  );
};
