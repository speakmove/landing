import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink, Container } from '@/shared/ui';
import { PATHS } from '@/shared/config';
import { buildBotUrl } from '@/shared/model/utils';

export const NotFoundPage = async () => {
  const t = await getTranslations('NotFoundPage');
  const locale = await getLocale();

  return (
    <section className="error-screen">
      <div className="err-bignum" aria-hidden="true">
        {t('code')}
      </div>

      <Container className="relative z-10 w-full">
        <h1 className="h-display-section mb-3.5 font-extrabold leading-[1.1] tracking-tight text-balance text-ink">
          {t('title')}
        </h1>
        <p className="mx-auto mb-9 max-w-135 text-pretty text-17 text-muted">
          {t('description')}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={PATHS.home} variant="primary" size="lg">
            {t('ctas.primary')}
          </ButtonLink>
          <a
            href={buildBotUrl(locale, 'landing-404')}
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            {t('ctas.secondary')}
          </a>
        </div>
      </Container>
    </section>
  );
};
