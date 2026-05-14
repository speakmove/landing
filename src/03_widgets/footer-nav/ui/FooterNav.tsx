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
    <nav aria-label="Footer">
      <ul className="space-y-2 text-sm">
        {links.map((item) => (
          <li key={item.href}>
            {isExternal(item.href) ? (
              <a
                href={item.href}
                className="text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href}
                className="text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
