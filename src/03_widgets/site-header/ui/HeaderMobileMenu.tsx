'use client';

import type { ReactElement } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRightIcon,
  BurgerIcon,
  ButtonLink,
  ChevronDownIcon,
  CloseIcon,
  InstagramIcon,
  LinkedinIcon,
  LogoHorizontal,
  Portal,
  TelegramIcon,
  ThreadsIcon,
} from '@/shared/ui';
import { LocaleSegmented } from '@/features/locale-switch';
import { ActiveLink } from '@/shared/ui';
import { ANCHORS, PATHS } from '@/shared/config';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { buildBotUrl, isSafeHref } from '@/shared/model/utils';
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
  instagram: <InstagramIcon size={20} />,
  telegram: <TelegramIcon size={20} />,
  linkedin: <LinkedinIcon size={20} />,
  threads: <ThreadsIcon size={20} />,
};

/** Easing from shared MOTION_EASE.out — inline to keep this file self-contained. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;


export const HeaderMobileMenu = () => {
  const t = useTranslations('HomePage.nav');
  const tLinks = useTranslations('HomePage.nav.links');
  const tFooter = useTranslations('HomePage.footer');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const { open, openMenu, close, buttonRef, firstLinkRef } = useMobileMenuState();
  const shouldReduce = useReducedMotion();
  const socialLinks = getList<TSocialLink>(tFooter, 'socialLinks').filter((s) =>
    isSafeHref(s.href),
  );

  const panelTransition = { duration: shouldReduce ? 0 : 0.24, ease: EASE_OUT };
  const fadeTransition = { duration: shouldReduce ? 0 : 0.2 };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={tCommon('aria.openMenu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={openMenu}
        className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
      >
        <BurgerIcon size={22} />
      </button>

      {/* Portal is always mounted; AnimatePresence inside controls enter/exit */}
      <Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop — tap to close */}
              <motion.div
                key="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="fixed inset-0 z-[99] bg-ink/40 lg:hidden"
                aria-hidden="true"
                onClick={close}
              />

              {/* Sliding panel */}
              <motion.div
                key="mobile-menu-panel"
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label={tCommon('aria.menu')}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={panelTransition}
                className="fixed right-0 top-0 z-[100] flex h-full w-[88vw] max-w-xs flex-col bg-white shadow-2xl lg:hidden"
              >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-line px-5">
                  <LogoHorizontal label={t('brand')} />
                  <button
                    type="button"
                    aria-label={tCommon('aria.closeMenu')}
                    onClick={close}
                    className="-mr-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <CloseIcon size={22} />
                  </button>
                </div>

                {/* Nav */}
                <nav aria-label={tCommon('aria.primary')} className="flex-1 overflow-y-auto">
                  <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
                    {NAV_ITEMS.map((item, idx) => (
                      <li key={item.key}>
                        <ActiveLink
                          ref={idx === 0 ? firstLinkRef : undefined}
                          href={item.href}
                          onClick={close}
                          className="flex items-center justify-between gap-4 px-5 py-5 text-xl font-semibold text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                          activeClassName="text-primary bg-primary-pale"
                        >
                          <span>{tLinks(item.key)}</span>
                          <ChevronDownIcon size={18} className="-rotate-90 text-muted" />
                        </ActiveLink>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex justify-center">
                    <LocaleSegmented size="lg" />
                  </div>

                  {socialLinks.length > 0 ? (
                    <div className="mt-10 px-5 pb-6">
                      <p className="m-0 mb-4 text-center text-12 font-semibold uppercase tracking-[0.12em] text-muted">
                        {t('mobile.followHeading')}
                      </p>
                      <ul className="m-0 flex list-none items-center justify-center gap-3 p-0">
                        {socialLinks.map((s) => (
                          <li key={s.id}>
                            <a
                              href={s.href}
                              aria-label={s.ariaLabel}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={close}
                              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary/65 transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                </nav>

                {/* CTA */}
                <div className="border-t border-line p-5">
                  <ButtonLink
                    href={buildBotUrl(locale, 'landing-mobile-menu')}
                    onClick={close}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    {t('cta')}
                    <ArrowRightIcon size={14} />
                  </ButtonLink>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};
