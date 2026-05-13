import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/shared/ui';
import { ScheduleCard } from '@/entities/schedule-card';
import type { TScheduleCard } from '@/entities/schedule-card';

type TProps = {
  namespace?: string;
};

export async function HomeSchedule({ namespace = 'HomePage.schedule' }: TProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);

  const cards = t.raw('cards') as unknown as TScheduleCard[];

  return (
    <Section id="schedule" ariaLabelledBy="schedule-heading">
      <Container>
        <div className="mb-10 max-w-[640px]">
          <span className="inline-block mb-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
            {t('kicker')}
          </span>
          <h2
            id="schedule-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--color-ink)] mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-[17px] text-[color:var(--color-muted)] leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <ScheduleCard key={card.id} card={card} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
