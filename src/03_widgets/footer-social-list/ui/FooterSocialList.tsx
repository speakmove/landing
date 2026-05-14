import { getTranslations } from 'next-intl/server';

type TSocialLink = {
  id: string;
  label: string;
  ariaLabel: string;
  href: string;
};

export const FooterSocialList = async () => {
  const t = await getTranslations('HomePage.footer');
  const socialLinks = t.raw('socialLinks') as unknown as TSocialLink[];

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{t('socialTitle')}</p>
      <ul className="mt-3 flex flex-wrap gap-3 text-sm">
        {socialLinks.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-label={item.ariaLabel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center rounded-lg border border-line px-3 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
