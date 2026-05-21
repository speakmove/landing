import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { cn } from '@/shared/model/libs/cn';
import { Container, Section, SectionHead } from '@/shared/ui';

type TBlock = {
  id: string;
  name: string;
  price: string;
  note: string;
  emphasis?: boolean;
};

export const PricingComparisonContext = async () => {
  const t = await getTranslations('PricingPage.comparison');
  const blocks = getList<TBlock>(t, 'blocks');

  return (
    <Section ariaLabelledBy="comparison-heading" className="py-12 md:py-16">
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="comparison-heading"
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {blocks.map((block) => (
            <li
              key={block.id}
              className={cn(
                'rounded-card border bg-white p-6 shadow-(--shadow-soft)',
                block.emphasis
                  ? 'border-primary/30 bg-primary-pale/40'
                  : 'border-line',
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3
                  className={cn(
                    'm-0 text-lg font-bold',
                    block.emphasis ? 'text-primary-ink' : 'text-ink',
                  )}
                >
                  {block.name}
                </h3>
                <span
                  className={cn(
                    'font-mono text-sm font-bold tabular-nums',
                    block.emphasis ? 'text-primary' : 'text-muted',
                  )}
                >
                  {block.price}
                </span>
              </div>
              <p className="mt-3 m-0 text-14-5 leading-relaxed text-muted">{block.note}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-7 max-w-2xl text-center text-pretty text-13 leading-relaxed text-muted">
          {t('closingLine')}
        </p>
      </Container>
    </Section>
  );
};
