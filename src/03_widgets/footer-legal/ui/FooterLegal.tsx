import { getTranslations } from 'next-intl/server';

export const FooterLegal = async () => {
  const t = await getTranslations('HomePage.footer');

  return (
    <div className="border-t border-line py-6 text-xs leading-relaxed text-faint">
      <p>{t('legalEntity')}</p>
      <p className="mt-3">{t('researchNotice')}</p>
    </div>
  );
};
