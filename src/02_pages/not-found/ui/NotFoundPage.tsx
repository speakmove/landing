import { getTranslations } from 'next-intl/server';
import { ButtonLink, Container } from '@/shared/ui';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { PATHS, URLS } from '@/shared/config';

type TSuggestionLink = {
  label: string;
  href: string;
};

export const NotFoundPage = async () => {
  const t = await getTranslations('NotFoundPage');
  const suggestionLinks = getList<TSuggestionLink>(t, 'suggestions.links');

  return (
    <section
      className="not-found-bg relative flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center overflow-hidden px-4 py-12 text-center md:py-16"
    >
      <div className="err-bignum" aria-hidden="true">
        {t('code')}
      </div>
      <Container className="relative z-10 w-full">
        <h1
          className="h-display-section mb-3.5 font-extrabold leading-[1.1] tracking-tight text-balance text-ink"
        >
          {t('title')}
        </h1>
        <p className="mx-auto mb-8 max-w-135 text-pretty text-[16.5px] text-muted">
          {t('description')}
        </p>

        <div className="mb-14 flex flex-wrap justify-center gap-3">
          <ButtonLink href={PATHS.home} variant="primary" size="lg">
            {t('ctas.primary')}
          </ButtonLink>
          <a href={URLS.telegramBot} rel="noopener noreferrer" className="btn btn-outline btn-lg">
            {t('ctas.secondary')}
          </a>
        </div>

        {suggestionLinks.length > 0 ? (
          <nav aria-label={t('suggestions.title')}>
            <p className="text-sm text-muted">{t('suggestions.title')}</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {suggestionLinks.map((item) => (
                <li key={item.href}>
                  <ButtonLink href={item.href} variant="ghost" className="!min-h-0 !p-0 text-primary hover:underline">
                    {item.label}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>
    </section>
  );
};
