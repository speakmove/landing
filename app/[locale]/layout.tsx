import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { SkipLink } from '@/shared/ui';
import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { ELEMENT_IDS } from '@/shared/config';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['500', '600'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MetaGlobal' });
  return {
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('defaultDescription'),
    openGraph: {
      siteName: t('siteName'),
      type: 'website',
      images: [{ url: '/opengraph-image', alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      site: t('twitterHandle'),
    },
  };
}

type TProps = PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: TProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SkipLink>{tCommon('skipToContent')}</SkipLink>
          <SiteHeader />
          <main id={ELEMENT_IDS.main}>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
