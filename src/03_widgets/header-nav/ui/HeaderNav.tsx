import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { PATHS, ANCHORS } from '@/shared/config';

type TLinkKey = 'howItWorks' | 'advantages' | 'compare' | 'pricing';
type TNavItem = { key: TLinkKey; href: string };

const NAV_ITEMS: TNavItem[] = [
  { key: 'howItWorks', href: PATHS.howItWorks },
  { key: 'advantages', href: `/#${ANCHORS.advantages}` },
  { key: 'compare', href: `/#${ANCHORS.compare}` },
  { key: 'pricing', href: PATHS.pricing },
];

export const HeaderNav = async () => {
  const tLinks = await getTranslations('HomePage.nav.links');

  return (
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
  );
};
