import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Logo } from '@/entities/brand';
import { ButtonLink, Container, ArrowRightIcon } from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { PATHS, URLS } from '@/shared/config';
import { HeaderNav } from './HeaderNav';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export const SiteHeader = async () => {
  const t = await getTranslations('HomePage.nav');

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/75 px-5 backdrop-blur-xl backdrop-saturate-[1.6] md:px-6">
      <Container>
        <div className="flex h-16 items-center gap-6">
          <Link
            href={PATHS.home}
            aria-label={t('brand')}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Logo />
          </Link>

          <HeaderNav />

          <div className="flex-1" />

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitch />
          </div>

          <ButtonLink href={URLS.telegramBot} size="sm" className="hidden lg:inline-flex">
            {t('cta')}
            <ArrowRightIcon size={14} />
          </ButtonLink>

          <HeaderMobileMenu />
        </div>
      </Container>
    </header>
  );
};
