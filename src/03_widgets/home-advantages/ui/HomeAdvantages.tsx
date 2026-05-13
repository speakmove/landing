import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { AdvantageTile } from '@/entities/advantage-tile';
import type { TAdvantageTile } from '@/entities/advantage-tile';

export async function HomeAdvantages() {
  const t = await getTranslations('HomePage.advantages');

  const tiles = t.raw('tiles') as unknown as TAdvantageTile[];

  return (
    <Section id="advantages" ariaLabelledBy="advantages-heading">
      <Container>
        {/* Section header */}
        <div className="mb-10 max-w-[640px]">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="advantages-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 5-tile bento grid: 1col → 2col md → 3col lg, last tile spans full row on lg */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile, i) => (
            <AdvantageTile
              key={tile.id}
              tile={tile}
              className={
                // 5th tile (index 4) spans full row on lg to avoid a lonely orphan
                i === 4 ? 'sm:col-span-2 lg:col-span-3' : undefined
              }
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
