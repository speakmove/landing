import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PricingPage } from '@/pages/pricing';
import { routing } from '@/shared/model/libs/i18n/routing';

type TProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PricingPage.meta' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}/pricing`]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}/pricing`, languages },
  };
}

export default async function Page({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingPage />;
}
