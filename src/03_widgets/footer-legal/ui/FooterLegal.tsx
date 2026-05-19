import { getTranslations } from 'next-intl/server';

type TBadge = {
  label: string;
};

export const FooterLegal = async () => {
  const t = await getTranslations('HomePage.footer');
  const badges = (t.raw('badges') as unknown as TBadge[] | undefined) ?? [];
  const copyright = t.has('copyright') ? t('copyright') : t('tagline');

  return (
    <div className="mt-10 border-t border-line pt-6">
      <div className="flex flex-col items-start gap-3 text-12-5 text-faint md:flex-row md:items-center md:justify-between">
        <p className="m-0">{copyright}</p>
        {badges.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
            {badges.map((badge) => (
              <li
                key={badge.label}
                className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-mini font-semibold text-muted"
              >
                {badge.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-4 space-y-3 text-xs leading-relaxed text-faint">
        <p>{t('legalEntity')}</p>
        <p>{t('researchNotice')}</p>
      </div>
    </div>
  );
};
