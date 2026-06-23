import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Logo } from '@/entities/brand';
import { ButtonLink, Container, ArrowRightIcon } from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { PATHS } from '@/shared/config';
import { buildBotUrl } from '@/shared/model/utils';
import { HeaderNav } from './HeaderNav';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export const SiteHeader = async () => {
  const t = await getTranslations('HomePage.nav');
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/75 px-5 backdrop-blur-xl backdrop-saturate-[1.6] md:px-6">
      <Container>
        {/* Mobile: flex justify-between (logo left, burger right).
            Desktop lg+: 3-col grid — logo LEFT · nav CENTER · right cluster RIGHT.
            The middle 1fr column lets the nav be truly centred regardless of side widths. */}
        <div className="flex h-16 items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto]">
          {/* Left: logo */}
          <Link
            href={PATHS.home}
            aria-label={t('brand')}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Logo />
          </Link>

          {/* Centre: desktop nav (hidden on mobile) */}
          <HeaderNav />

          {/* Right: locale switch + CTA + mobile burger */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              <LocaleSwitch />
            </div>

            <ButtonLink href={buildBotUrl(locale)} size="sm" className="hidden lg:inline-flex">
              {t('cta')}
              <ArrowRightIcon size={14} />
            </ButtonLink>

            <HeaderMobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
};
