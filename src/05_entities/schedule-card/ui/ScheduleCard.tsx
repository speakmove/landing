import { Badge, Card } from '@/shared/ui';
import type { TScheduleCard } from '../model/types';

type TProps = {
  card: TScheduleCard;
};

export const ScheduleCard = ({ card }: TProps) => {
  return (
    <Card as="article" className="flex flex-col gap-4">
      {card.badge && (
        <Badge tone="primary" className="self-start">
          {card.badge}
        </Badge>
      )}

      <div>
        <h3 className="text-lg font-bold text-ink mb-1 leading-snug">
          {card.title}
        </h3>
        <p className="text-xs text-muted font-medium">{card.subtitle}</p>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        {card.description}
      </p>

      <div className="flex gap-1.5 flex-wrap" aria-label="Дни недели">
        {card.days.map((day, i) => {
          const isActive = card.activeDays[i] ?? false;
          return (
            <span
              key={day}
              className={[
                'inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold min-w-[36px]',
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-surface text-muted border border-line',
              ].join(' ')}
            >
              {day}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
