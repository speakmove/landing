import { setRequestLocale, getTranslations } from 'next-intl/server';

type TProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');
  return <main className="p-8 text-2xl">{t('brand')} — {locale}</main>;
}
