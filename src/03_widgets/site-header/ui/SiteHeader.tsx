import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Logo } from '@/entities/brand';
import { Button, Container, ArrowRightIcon } from '@/shared/ui';
import { LocaleSwitch } from '@/features/locale-switch';
import { PATHS, ANCHORS } from '@/shared/config';

type TLinkKey = 'howItWorks' | 'advantages' | 'compare' | 'pricing';
type TNavItem = { key: TLinkKey; href: string };

const NAV_ITEMS: TNavItem[] = [
  { key: 'howItWorks', href: PATHS.howItWorks },
  { key: 'advantages', href: `/#${ANCHORS.advantages}` },
  { key: 'compare', href: `/#${ANCHORS.compare}` },
  { key: 'pricing', href: PATHS.pricing },
];

export const SiteHeader = async () => {
  const t = await getTranslations('HomePage.nav');
  const tLinks = await getTranslations('HomePage.nav.links');

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

          <nav aria-label="Primary" className="ml-3 hidden lg:flex">
            <ul className="flex gap-7 text-sm font-medium text-muted">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {tLinks(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

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
}
