import { getTranslations } from 'next-intl/server';

export const FooterLegal = async () => {
  const t = await getTranslations('HomePage.footer');

  return (
    <div className="pt-7 text-center text-[12.5px] leading-relaxed text-faint">
      <p>{t('legalEntity')}</p>
      <p className="mt-3">{t('researchNotice')}</p>
    </div>
  );
};
