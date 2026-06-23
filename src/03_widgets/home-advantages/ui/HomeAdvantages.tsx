import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { cn } from '@/shared/model/libs/cn';
import { Container, Reveal, Section, SectionHead } from '@/shared/ui';
import { AdvantageTile, VARIANT_BY_ID } from '@/entities/advantage-tile';
import { ANCHORS } from '@/shared/config';
import type { TAdvantageTile } from '@/entities/advantage-tile';

/**
 * Bento span classes for each tile id.
 * Layout (lg, 4-col grid, rows hug content; DOM/auto-flow order
 * voice → uk-scenarios → native-feedback → in-telegram → honest-pricing):
 *
 *   [ voice  voice ] [ uk-scenarios uk-scenarios ]
 *   [ native ] [ in-telegram in-telegram ] [ honest(gold) ]
 *
 * Variety comes from WIDTH (wide vs narrow tiles), not forced row-spans — so
 * tiles never get vertical voids. No gaps; mobile collapses to 1 column.
 */
const SPAN_BY_ID: Record<string, string> = {
  voice: 'sm:col-span-2 lg:col-span-2',
  'uk-scenarios': 'sm:col-span-2 lg:col-span-2',
  'native-feedback': 'lg:col-span-1',
  'in-telegram': 'sm:col-span-2 lg:col-span-2',
  'honest-pricing': 'lg:col-span-1',
};

export const HomeAdvantages = async () => {
  const t = await getTranslations('HomePage.advantages');
  const tiles = getList<TAdvantageTile>(t, 'tiles');

  return (
    <Section
      id={ANCHORS.advantages}
      ariaLabelledBy="advantages-heading"
      className="py-16 md:py-22"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="advantages-heading"
          subtitle={t('subtitle')}
        />

        {/* Each tile reveals independently as it scrolls into view (not a
            single stagger burst), so on mobile they appear one-by-one. */}
        <div className="bento-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Reveal
              key={tile.id}
              variant="scaleUp"
              className={cn('h-full', SPAN_BY_ID[tile.id])}
            >
              <AdvantageTile
                tile={tile}
                variant={VARIANT_BY_ID[tile.id] ?? 'default'}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
};
