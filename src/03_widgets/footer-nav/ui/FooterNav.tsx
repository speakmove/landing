import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';

type TFooterLink = {
  label: string;
  href: string;
};

const isExternal = (href: string): boolean => {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
};

export const FooterNav = async () => {
  const t = await getTranslations('HomePage.footer');
  const links = t.raw('links') as unknown as TFooterLink[];

  return (
    <nav
      aria-label="Footer"
      className="flex flex-wrap gap-x-7 gap-y-2.5 text-[14px] text-muted md:justify-center"
    >
      {links.map((item) =>
        isExternal(item.href) ? (
          <a
            key={item.href}
            href={item.href}
            className="transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            rel="noopener noreferrer"
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className="transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
};
