import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Container } from '@/shared/ui';
import { Logo } from '@/entities/brand';
import { PATHS } from '@/shared/config';
import { FooterNav } from '@/widgets/footer-nav';
import { FooterSocialList } from '@/widgets/footer-social-list';
import { FooterLegal } from '@/widgets/footer-legal';

export const SiteFooter = async () => {
  const t = await getTranslations('HomePage.footer');

  return (
    <footer className="border-t border-line px-5 md:px-6">
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link
              href={PATHS.home}
              aria-label={t('brand')}
              className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Logo />
            </Link>
            <p className="mt-4 max-w-72 text-[13.5px] leading-relaxed text-muted">
              {t('tagline')}
            </p>
            <div className="mt-5">
              <FooterSocialList />
            </div>
          </div>

          <FooterNav />
        </div>

        <FooterLegal />
      </Container>
    </footer>
  );
};
