import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/pages/home';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.meta' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage />;
}
