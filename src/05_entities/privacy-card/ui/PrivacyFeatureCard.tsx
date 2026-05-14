import { Badge, Card } from '@/shared/ui';
import type { TPrivacyCard } from '../model/types';

type TProps = {
  card: TPrivacyCard;
};

export function PrivacyFeatureCard({ card }: TProps) {
  return (
    <Card as="article" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-ink leading-snug">
          {card.title}
        </h3>
        {card.badge && (
          <Badge tone="neutral" className="flex-none">
            {card.badge}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted leading-relaxed">
        {card.description}
      </p>
    </Card>
  );
}
