import { getTranslations } from 'next-intl/server';
import { PATHS, ANCHORS } from '@/shared/config';
import { ActiveLink } from '@/shared/ui';

type TLinkKey = 'howItWorks' | 'advantages' | 'pricing';
type TNavItem = { key: TLinkKey; href: string };

const NAV_ITEMS: TNavItem[] = [
  { key: 'howItWorks', href: PATHS.howItWorks },
  { key: 'advantages', href: `/#${ANCHORS.advantages}` },
  { key: 'pricing', href: PATHS.pricing },
];

export const HeaderNav = async () => {
  const tLinks = await getTranslations('HomePage.nav.links');
  const tCommon = await getTranslations('Common');

  return (
    <nav aria-label={tCommon('aria.primary')} className="hidden lg:flex lg:justify-center">
      <ul className="flex gap-7 text-sm font-medium text-muted">
        {NAV_ITEMS.map((item) => (
          <li key={item.key}>
            <ActiveLink
              href={item.href}
              className="nav-link transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              activeClassName="nav-link--active text-primary font-semibold"
            >
              {tLinks(item.key)}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
