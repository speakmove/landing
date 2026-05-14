import { getTranslations } from 'next-intl/server';
import { Link } from '@/shared/model/libs/i18n/navigation';
import { Button, Container, Section } from '@/shared/ui';

type TSuggestionLink = {
  label: string;
  href: string;
};

export async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');
  const suggestionLinks = (t.raw('suggestions.links') as TSuggestionLink[]) ?? [];
  return (
    <Section>
      <Container className="max-w-180 text-center">
        <p className="font-mono text-7xl font-bold tracking-tight text-primary">
          {t('code')}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-muted">{t('description')}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="lg">
              {t('ctas.primary')}
            </Button>
          </Link>
        </div>

        {suggestionLinks.length > 0 ? (
          <nav aria-label={t('suggestions.title')} className="mt-10">
            <p className="text-sm text-muted">{t('suggestions.title')}</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {suggestionLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>
    </Section>
  );
}
