import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NotFoundPage } from '@/pages/not-found';

type TProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'NotFoundPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    robots: t('robots'),
  };
}

export default function NotFound() {
  return <NotFoundPage />;
}
