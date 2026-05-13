import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Container } from '@/shared/ui';
import { Logo } from '@/entities/brand';

type TFooterLink = {
  label: string;
  href: string;
};

type TSocialLink = {
  id: string;
  label: string;
  ariaLabel: string;
  href: string;
};

function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
}

export async function SiteFooter() {
  const t = await getTranslations('HomePage.footer');
  const links = t.raw('links') as unknown as TFooterLink[];
  const socialLinks = t.raw('socialLinks') as unknown as TSocialLink[];

  return (
    <footer className="mt-16 border-t border-[color:var(--color-line)] bg-white">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label={t('brand')}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
            >
              <Logo />
            </Link>
            <p className="mt-4 max-w-[480px] text-sm leading-[1.55] text-[color:var(--color-muted)]">
              {t('tagline')}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="space-y-2 text-sm">
              {links.map((item) => (
                <li key={item.href}>
                  {isExternal(item.href) ? (
                    <a
                      href={item.href}
                      className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-[color:var(--color-ink)]">{t('socialTitle')}</p>
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {socialLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-label={item.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center rounded-lg border border-[color:var(--color-line)] px-3 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[color:var(--color-line)] py-6 text-xs leading-relaxed text-[color:var(--color-faint)]">
          <p>{t('legalEntity')}</p>
          <p className="mt-3">{t('researchNotice')}</p>
        </div>
      </Container>
    </footer>
  );
}
