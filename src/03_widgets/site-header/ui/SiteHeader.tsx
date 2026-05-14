import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Logo } from '@/entities/brand';
import { Button, Container, ArrowRightIcon } from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { PATHS } from '@/shared/config';
import { HeaderNav } from '@/widgets/header-nav';

export const SiteHeader = async () => {
  const t = await getTranslations('HomePage.nav');

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur">
      <Container>
        <div className="flex min-h-16 items-center gap-4 py-3">
          <Link
            href={PATHS.home}
            aria-label={t('brand')}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Logo />
          </Link>

          <HeaderNav />

          <div className="flex-1" />

          <div className="hidden sm:block">
            <LocaleSwitch />
          </div>

          <Link href={PATHS.waitlist}>
            <Button size="sm">
              {t('cta')}
              <ArrowRightIcon size={14} />
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
};
