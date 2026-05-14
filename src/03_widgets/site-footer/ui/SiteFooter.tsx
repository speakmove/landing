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
    <footer className="border-t border-line px-5">
      <Container className="px-4 py-8 md:py-10">
        <div className="grid gap-6 md:grid-cols-3 md:items-center md:gap-8">
          <Link
            href={PATHS.home}
            aria-label={t('brand')}
            className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Logo />
          </Link>

          <FooterNav />

          <FooterSocialList />
        </div>

        <FooterLegal />
      </Container>
    </footer>
  );
};
