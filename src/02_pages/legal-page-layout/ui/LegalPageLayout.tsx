import { getTranslations } from 'next-intl/server';
import { Container, Section, InlineMarkdown } from '@/shared/ui';

type TLegalSection = {
  id: string;
  heading: string;
  body: Array<string | { type: 'list'; items: string[] }>;
};

type TLegalMeta = {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string;
};

type TProps = {
  namespace: 'PrivacyPage' | 'TermsPage' | 'CookiesPage';
};

export const LegalPageLayout = async ({ namespace }: TProps) => {
  const t = await getTranslations(namespace as never);
  const tCommon = await getTranslations('Common');
  const meta = t.raw('meta') as unknown as TLegalMeta;
  const sections = t.raw('sections') as unknown as TLegalSection[];

  return (
    <>
      <Section className="pb-0">
        <Container className="max-w-205">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{meta.title}</h1>
          <p className="mt-4 text-sm text-muted">
            <span>{tCommon('effectiveLabel')} {meta.effectiveDate}</span>
            <span aria-hidden="true"> · </span>
            <span>{tCommon('lastUpdatedLabel')} {meta.lastUpdated}</span>
          </p>
          <p className="mt-6 leading-relaxed text-ink">{meta.intro}</p>
        </Container>
      </Section>

      <Section className="pt-10">
        <Container className="max-w-205">
          <nav aria-label={tCommon('navSections')} className="mb-12 rounded-2xl border border-line bg-white p-5">
            <ol className="grid gap-2 text-sm md:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2
                  id={`${section.id}-heading`}
                  className="text-xl font-bold text-ink md:text-2xl"
                >
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((block, idx) => {
                    if (typeof block === 'string') {
                      return (
                        <p key={idx} className="leading-relaxed text-ink">
                          <InlineMarkdown text={block} />
                        </p>
                      );
                    }
                    if (block && typeof block === 'object' && block.type === 'list') {
                      return (
                        <ul
                          key={idx}
                          className="ml-5 list-disc space-y-2 text-ink"
                        >
                          {block.items.map((item, j) => (
                            <li key={j} className="leading-relaxed">
                              <InlineMarkdown text={item} />
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (block && typeof block === 'object') {
                      // Unknown block type — fail safe
                      console.warn('[legal-page-layout] unknown body block', block);
                    }
                    return null;
                  })}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
