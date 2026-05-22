import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/shared/model/libs/i18n/routing';
import { JsonLd, LenisProvider, SkipLink } from '@/shared/ui';
import { PhoneJourney, PhoneJourneyProvider } from '@/widgets/phone-journey';
import { SiteHeader } from '@/widgets/site-header';
import { SiteFooter } from '@/widgets/site-footer';
import { ELEMENT_IDS, URLS } from '@/shared/config';
import { env } from '@/shared/model/libs/env';
import { buildOrganizationLd } from '@/shared/model/libs/jsonld';
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
    robots: env.NEXT_PUBLIC_INDEXABLE
      ? undefined
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
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
  const tMeta = await getTranslations({ locale, namespace: 'MetaGlobal' });

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const organizationLd = buildOrganizationLd({
    name: tMeta('siteName'),
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/brand/speakmove-logo.svg`,
    description: tMeta('defaultDescription'),
    sameAs: [
      URLS.telegramChannel,
      URLS.instagram,
      URLS.tiktok,
      URLS.youtube,
      URLS.twitter,
    ],
    contactEmail: tMeta('contactEmail'),
  });

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <LenisProvider>
            <PhoneJourneyProvider>
              <SkipLink>{tCommon('skipToContent')}</SkipLink>
              <SiteHeader />
              <main id={ELEMENT_IDS.main}>{children}</main>
              <SiteFooter />
              <JsonLd data={organizationLd} />
              <PhoneJourney />
            </PhoneJourneyProvider>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
