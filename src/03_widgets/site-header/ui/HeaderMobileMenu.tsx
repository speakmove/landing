'use client';

import type { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/shared/model/libs/i18n/navigation';
import {
  ArrowRightIcon,
  BurgerIcon,
  ButtonLink,
  CloseIcon,
  InstagramIcon,
  LogoHorizontal,
  MailIcon,
  Portal,
  TelegramIcon,
  ThreadsIcon,
  TikTokIcon,
} from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { ANCHORS, PATHS, URLS } from '@/shared/config';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { isSafeHref } from '@/shared/model/utils';
import { useMobileMenuState } from '../model/hooks/useMobileMenuState';

type TLinkKey = 'howItWorks' | 'advantages' | 'pricing';
type TNavItem = { key: TLinkKey; href: string };
type TSocialLink = {
  id: string;
  label: string;
  ariaLabel: string;
  href: string;
};

const NAV_ITEMS: TNavItem[] = [
  { key: 'howItWorks', href: PATHS.howItWorks },
  { key: 'advantages', href: `/#${ANCHORS.advantages}` },
  { key: 'pricing', href: PATHS.pricing },
];

const SOCIAL_ICONS: Record<string, ReactElement> = {
  instagram: <InstagramIcon size={22} />,
  telegram: <TelegramIcon size={22} />,
  tiktok: <TikTokIcon size={22} />,
  threads: <ThreadsIcon size={22} />,
};

export const HeaderMobileMenu = () => {
  const t = useTranslations('HomePage.nav');
  const tLinks = useTranslations('HomePage.nav.links');
  const tFooter = useTranslations('HomePage.footer');
  const tCommon = useTranslations('Common');
  const { open, openMenu, close, buttonRef, firstLinkRef } = useMobileMenuState();
  const socialLinks = getList<TSocialLink>(tFooter, 'socialLinks').filter((s) =>
    isSafeHref(s.href),
  );
  const contactHref = URLS.contactEmail;

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

              {socialLinks.length > 0 ? (
                <div className="mt-10">
                  <p className="m-0 mb-3 px-4 text-13 font-semibold uppercase tracking-wider text-muted">
                    {t('mobile.followHeading')}
                  </p>
                  <ul className="m-0 flex list-none gap-2 px-4 p-0">
                    {socialLinks.map((s) => (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          aria-label={s.ariaLabel}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {SOCIAL_ICONS[s.id.toLowerCase()] ?? (
                            <span aria-hidden="true" className="text-13 font-semibold">
                              {s.label[0]}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 px-4">
                <a
                  href={contactHref}
                  onClick={close}
                  className="inline-flex items-center gap-2 text-15 font-medium text-ink underline-offset-4 transition hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <MailIcon size={18} />
                  {t('mobile.contactLabel')}
                </a>
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
