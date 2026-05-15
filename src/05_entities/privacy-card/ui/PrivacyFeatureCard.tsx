import type { ComponentType } from 'react';
import {
  Badge,
  ClockIcon,
  EditIcon,
  ExportIcon,
  LockIcon,
  ShieldIcon,
  UserPlusIcon,
} from '@/shared/ui';
import type { TPrivacyCard } from '../model/types';

type TProps = {
  card: TPrivacyCard;
};

type TIconComponent = ComponentType<{ size?: number; className?: string }>;

const ICON_MAP: Record<string, TIconComponent> = {
  gdpr: ShieldIcon,
  encryption: LockIcon,
  consent: UserPlusIcon,
  moderation: EditIcon,
  cancel: ClockIcon,
  export: ExportIcon,
};

export const PrivacyFeatureCard = ({ card }: TProps) => {
  const IconComponent = ICON_MAP[card.id] ?? ShieldIcon;

  return (
    <article className="card-hover flex h-full flex-col rounded-[18px] border border-line bg-white p-6 shadow-(--shadow-soft)">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-primary-pale text-primary">
          <IconComponent size={20} />
        </span>
        {card.badge ? (
          <Badge tone="neutral" className="flex-none">
            {card.badge}
          </Badge>
        ) : null}
      </div>
      <h3 className="mb-1.5 text-base font-bold leading-snug text-ink">{card.title}</h3>
      <p className="m-0 text-sm leading-relaxed text-muted">{card.description}</p>
    </article>
  );
};
