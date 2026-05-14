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
    <footer className="mt-16 border-t border-line bg-white">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href={PATHS.home}
              aria-label={t('brand')}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Logo />
            </Link>
            <p className="mt-4 max-w-120 text-sm leading-[1.55] text-muted">
              {t('tagline')}
            </p>
          </div>

          <FooterNav />

          <FooterSocialList />
        </div>

        <FooterLegal />
      </Container>
    </footer>
  );
};
