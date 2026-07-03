import { getLocale, getTranslations } from 'next-intl/server';
import { buildBotUrl } from '@/shared/model/utils';
import { StickyCtaBar } from './StickyCtaBar';

export const StickyCta = async () => {
  const t = await getTranslations('HomePage.nav');
  const locale = await getLocale();

  return <StickyCtaBar ctaLabel={t('cta')} ctaHref={buildBotUrl(locale, 'landing-sticky-cta')} />;
};
