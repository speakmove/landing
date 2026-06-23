import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { ActiveLink } from '@/shared/ui';
import { isExternal } from '@/shared/model/utils';

type TFooterLink = {
  label: string;
  href: string;
};

type TFooterColumn = {
  title: string;
  links: TFooterLink[];
};

export const FooterNav = async () => {
  const t = await getTranslations('HomePage.footer');
  const columns = getList<TFooterColumn>(t, 'columns');

  return (
    <>
      {columns.map((column) => {
        const headingId = `footer-col-${column.title.toLowerCase().replace(/\s+/g, '-')}`;
        return (
          <nav key={column.title} aria-labelledby={headingId} className="text-sm">
            <h3
              id={headingId}
              className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-ink"
            >
              {column.title}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-muted">
              {column.links.map((item) => (
                <li key={item.href}>
                  {isExternal(item.href) ? (
                    <a
                      href={item.href}
                      className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <ActiveLink
                      href={item.href}
                      className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      activeClassName="text-primary font-semibold"
                    >
                      {item.label}
                    </ActiveLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        );
      })}
    </>
  );
};
