import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PrivacyPage } from '@/pages/privacy';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPage.meta' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}/privacy`]));
  return {
    title: t('title_meta'),
    alternates: { canonical: `/${locale}/privacy`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyPage />;
}
