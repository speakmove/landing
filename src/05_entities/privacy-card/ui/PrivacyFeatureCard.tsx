import { Badge } from '@/shared/ui';
import type { TPrivacyCard } from '../model/types';

type TProps = {
  card: TPrivacyCard;
};

export const PrivacyFeatureCard = ({ card }: TProps) => {
  return (
    <article className="card-hover flex h-full flex-col gap-3 rounded-[18px] border border-line bg-white p-6 shadow-(--shadow-soft)">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold leading-snug text-ink">{card.title}</h3>
        {card.badge ? (
          <Badge tone="neutral" className="flex-none">
            {card.badge}
          </Badge>
        ) : null}
      </div>
      <p className="m-0 text-sm leading-relaxed text-muted">{card.description}</p>
    </article>
  );
};
