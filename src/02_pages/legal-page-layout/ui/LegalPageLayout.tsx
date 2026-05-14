import { getTranslations } from 'next-intl/server';
import { Container, InlineMarkdown } from '@/shared/ui';

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
    <Container className="px-5">
      <header className="border-b border-line py-12">
        <h1
          className="mb-3 font-extrabold leading-[1.1] tracking-tight text-ink"
          style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
        >
          {meta.title}
        </h1>
        <p className="m-0 text-[16px] text-muted">{meta.intro}</p>
        <div className="mt-3 font-mono text-[13px] text-faint">
          <span>
            {tCommon('effectiveLabel')} {meta.effectiveDate}
          </span>
          <span aria-hidden="true"> · </span>
          <span>
            {tCommon('lastUpdatedLabel')} {meta.lastUpdated}
          </span>
        </div>
      </header>

      <div className="grid items-start gap-12 py-12 lg:grid-cols-[220px_1fr]">
        <aside
          aria-label={tCommon('navSections')}
          className="hidden text-[13.5px] lg:sticky lg:top-[88px] lg:block"
        >
          <h2 className="m-0 mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-faint">
            {tCommon('navSections')}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-lg px-2.5 py-1.5 font-medium text-muted transition hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="text-[15.5px] leading-[1.6]">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="mb-8 last:mb-0"
            >
              <h2
                id={`${section.id}-heading`}
                className="mt-8 mb-4 text-[24px] font-extrabold leading-[1.2] tracking-[-0.015em] text-ink first:mt-0"
              >
                {section.heading}
              </h2>
              {section.body.map((block, idx) => {
                if (typeof block === 'string') {
                  return (
                    <p key={`${section.id}-p-${idx}`} className="mb-5 text-muted">
                      <InlineMarkdown text={block} />
                    </p>
                  );
                }
                if (block && typeof block === 'object' && block.type === 'list') {
                  return (
                    <ul
                      key={`${section.id}-ul-${idx}`}
                      className="mb-5 list-disc pl-6 text-muted"
                    >
                      {block.items.map((item, j) => (
                        <li key={`${section.id}-li-${idx}-${j}`} className="mb-2">
                          <InlineMarkdown text={item} />
                        </li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </section>
          ))}
        </main>
      </div>
    </Container>
  );
};
