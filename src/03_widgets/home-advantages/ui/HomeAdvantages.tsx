import { getTranslations } from 'next-intl/server';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container, Section, SectionHead } from '@/shared/ui';
import { AdvantageTile } from '@/entities/advantage-tile';
import { ANCHORS } from '@/shared/config';
import type { TAdvantageTile } from '@/entities/advantage-tile';

const SPAN: Record<number, string> = {
  0: 'lg:col-span-3',
  1: 'lg:col-span-3',
  2: 'lg:col-span-2',
  3: 'lg:col-span-2',
  4: 'lg:col-span-2',
};

export const HomeAdvantages = async () => {
  const t = await getTranslations('HomePage.advantages');
  const tiles = getList<TAdvantageTile>(t, 'tiles');

  return (
    <Section
      id={ANCHORS.advantages}
      ariaLabelledBy="advantages-heading"
      className="bg-surface py-16 md:py-22"
    >
      <Container>
        <SectionHead
          kicker={t('kicker')}
          title={t('title')}
          titleId="advantages-heading"
          subtitle={t('subtitle')}
        />

        <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {tiles.map((tile, i) => (
            <AdvantageTile key={tile.id} tile={tile} className={SPAN[i]} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
